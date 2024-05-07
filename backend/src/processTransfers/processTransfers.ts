import axios from "axios";
import { db } from "../db/models/index.js";
import { mintNfts } from "./mintNfts.js";
import convertToHumanCrc from "../utils/convertToHumanCrc.js";
import { fetchTransfers } from "./fetchTransfers.js";
import getNftAmount from "../utils/getNftAmount.js";

const checkIfTransferExists = async (
  transactionHash: string
): Promise<boolean> => {
  const transfer = await db.models.Transfer.findOne({
    where: { transactionHash: transactionHash, processed: 1 },
  });
  return !!transfer;
};

interface TransferRow {
  nftAmount: number | null;
  nftMinted: number | null;
}

const getTotalNftAmountForAddress = async (
  fromAddress: string
): Promise<number> => {
  try {
    const transfers: TransferRow[] = await db.models.Transfer.findAll({
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
  try {
    const response = await fetchTransfers();
    // console.log("processTransfers", response.data.result.length);
    if (response.data && response.data.result) {
      let i = 1;
      for (const transfer of response.data.result) {
        console.log(`iteration ${i++} of ${response.data.result.length}`);
        const {
          transactionHash,
          fromAddress,
          toAddress,
          timestamp,
          amount,
          blockNumber,
        } = transfer;

        const transferExists = await checkIfTransferExists(transactionHash);
        if (transferExists) continue; // already processed

        const transferId = transactionHash.slice(-5);

        const crcAmount = convertToHumanCrc(amount, timestamp);
        const nftAmountFromTransfer = getNftAmount(crcAmount);
        const nftAlreadyMinted = await getTotalNftAmountForAddress(fromAddress);
        // max 3 NFTs per address
        const maxNftsPerAddress = 3;
        const remainingNftQuota = maxNftsPerAddress - nftAlreadyMinted;
        const nftAmountToMint = Math.min(
          nftAmountFromTransfer,
          remainingNftQuota,
          maxNftsPerAddress
        );

        if (nftAmountToMint > 0) {
          console.log("✨✨✨🚀");
          console.log(`${transferId} - FOUND NEW TRANSFER FROM ${fromAddress}`);

          try {
            const [transfer] = await db.models.Transfer.upsert(
              {
                transactionHash,
                fromAddress,
                toAddress,
                timestamp,
                amount,
                crcAmount,
                blockNumber,
                processed: true,
                nftAmount: nftAmountToMint,
              },
              {
                returning: true, // This ensures that the full object is returned
              }
            );

            try {
              await mintNfts({
                transactionHash,
                fromAddress,
                amount,
                crcAmount,
                nftAmount: nftAmountToMint,
                nftMinted: transfer.nftMinted,
                timestamp,
              });
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
