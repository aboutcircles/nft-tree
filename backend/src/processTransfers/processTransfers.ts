import { db } from "../db/models/index.js";
import { mintNfts } from "./mintNfts.js";
import convertToHumanCrc from "../utils/convertToHumanCrc.js";
import { fetchTransfers } from "./fetchTransfers.js";
import getNftAmount from "../utils/getNftAmount.js";
import { Transfer } from "../types/Transfer.js";

const findTransfer = async (
  transactionHash: string
): Promise<Transfer | null> => {
  const transfer = await db.models.Transfer.findByPk(transactionHash);
  return transfer;
};

const getTotalNftAmountForAddress = async (
  fromAddress: string
): Promise<number> => {
  try {
    const transfers: Transfer[] = await db.models.Transfer.findAll({
      where: { fromAddress: fromAddress },
      attributes: ["nftMinted"],
    });

    const totalNftAmount = transfers.reduce(
      (acc: number, transfer) => acc + (transfer.nftMinted || 0),
      0
    );
    return totalNftAmount;
  } catch (err) {
    console.error("Error fetching NFT amounts", err);
    throw err;
  }
};

export async function processTransfers(): Promise<void> {
  // give 1 more day to process transfers
  console.log("processTransfers");
  console.log("Date now", Date.now() / 1000);
  const START_TIME = Number(process.env.START_TIME) || 1716242400;
  const END_TIME = Number(process.env.END_TIME) || 1716516000;
  console.log("START_TIME", START_TIME);
  console.log("END_TIME", END_TIME);
  console.log(Date.now() / 1000 > END_TIME + 86400000);
  if (Date.now() / 1000 > END_TIME + 86400000) return;

  console.log(" try to fetch");

  try {
    const response = await fetchTransfers();
    if (response.data && response.data.result) {
      let i = 1;
      for (const donation of response.data.result) {
        const {
          transactionHash,
          fromAddress,
          toAddress,
          timestamp,
          amount,
          blockNumber,
        } = donation;

        console.log(`${i++} of ${response.data.result.length}`);
        console.log(Number(timestamp), START_TIME, END_TIME);

        if (Number(timestamp) < START_TIME) continue; // start
        if (Number(timestamp) > END_TIME) continue; // end

        let dbTransfer = await findTransfer(transactionHash);
        if (dbTransfer && dbTransfer.processed) continue; // already processed

        const transferId = transactionHash.slice(-5);

        const crcAmount = convertToHumanCrc(amount, timestamp);
        console.log(`   ${transferId} - crcAmount: ${crcAmount}`);
        const nftAmountFromTransfer = getNftAmount(crcAmount);
        // console.log(
        //   `   ${transferId} - nftAmountFromTransfer: ${nftAmountFromTransfer}`
        // );
        const nftAlreadyMinted = await getTotalNftAmountForAddress(fromAddress);
        console.log(`   ${transferId} - nftAlreadyMinted: ${nftAlreadyMinted}`);
        // max 3 NFTs per address
        const maxNftsPerAddress = 3;
        const remainingNftQuota = maxNftsPerAddress - nftAlreadyMinted;
        const nftAmountToMint = Math.min(
          nftAmountFromTransfer,
          remainingNftQuota,
          maxNftsPerAddress
        );
        // console.log(`${transferId} - nftAmountToMint: ${nftAmountToMint}`);
        if (nftAmountToMint > 0) {
          console.log("✨✨✨🚀");
          console.log(`${transferId} - FOUND NEW TRANSFER FROM ${fromAddress}`);

          try {
            if (dbTransfer) {
              await db.models.Transfer.update(
                {
                  processed: true,
                  nftAmount: nftAmountToMint,
                },
                {
                  where: {
                    transactionHash: transactionHash,
                  },
                }
              );
            } else {
              dbTransfer = await db.models.Transfer.create({
                transactionHash,
                fromAddress,
                toAddress,
                timestamp,
                amount,
                crcAmount,
                blockNumber,
                processed: true,
                nftAmount: nftAmountToMint,
              });
            }

            try {
              await mintNfts(dbTransfer, nftAmountToMint);
            } catch (error) {
              console.log(`${transferId} ERROR PROCESSING TRANSFER`);
              console.log(error);
            }
          } catch (error) {
            console.error(
              `${transferId} Error inserting transfers data into the database`
            );
            console.error(error);
          }
        } else {
          try {
            await db.models.Transfer.upsert({
              transactionHash,
              fromAddress,
              toAddress,
              timestamp,
              amount,
              crcAmount,
              blockNumber,
              processed: true,
              nftAmount: 0,
              nftMinted: 0,
            });
          } catch (error) {
            console.error(
              `${transferId} Error inserting transfers data into the database`
            );
            console.error(error);
          }
        }
      }
      // console.log(
      //   `finish iteration for ${response.data.result.length} transfers`
      // );
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
