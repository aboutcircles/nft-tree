import axios from "axios";
import db from "../database.js";
import { mintNfts } from "./mintNfts.js";
import convertToHumanCrc from "../utils/convertToHumanCrc.js";
import { fetchTransfers } from "./fetchTransfers.js";

const getNftAmount = (crcAmountInWei: string, timestamp: string) => {
  const tcAmount = convertToHumanCrc(crcAmountInWei, timestamp);
  const nftAmount = Math.trunc(tcAmount / Number(process.env.NFT_COST_CRC));

  if (nftAmount < 3) {
    return nftAmount;
  } else {
    return 3;
  }
};

const checkIfTransferExists = (transactionHash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 1 FROM transfers WHERE transactionHash = ? LIMIT 1`;
    db.get(query, [transactionHash], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? true : false); // If row is found, return true, otherwise false
      }
    });
  });
};

interface TransferRow {
  nftAmount: number | null;
}

const getTotalNftAmountForAddress = async (
  fromAddress: string
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM transfers WHERE fromAddress = ?`;
    db.all(query, [fromAddress], (err, rows: TransferRow[]) => {
      if (err) {
        console.error("Error fetching NFT amounts", err);
        reject(err);
      } else {
        let totalNftAmount = 0;
        rows.forEach((row) => {
          totalNftAmount += row.nftAmount || 0;
        });
        resolve(totalNftAmount);
      }
    });
  });
};

export async function processTransfers(): Promise<void> {
  try {
    const response = await fetchTransfers();
    if (response.data && response.data.result) {
      let i = 0;
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

        const nftAmountFromTransfer = getNftAmount(amount, timestamp);
        const nftAlreadyMinted = await getTotalNftAmountForAddress(fromAddress);
        // max 3 NFTs per address
        const maxNftsPerAddress = 3;
        const remainingNftQuota = maxNftsPerAddress - nftAlreadyMinted;
        const nftAmount = Math.min(
          nftAmountFromTransfer,
          remainingNftQuota,
          maxNftsPerAddress
        );

        if (nftAmount > 0) {
          console.log("✨✨✨🚀");
          console.log(`${transferId} - FOUND NEW TRANSFER FROM ${fromAddress}`);

          const insertQuery = `
          INSERT INTO transfers (transactionHash, fromAddress, toAddress, timestamp, amount, blockNumber, processed, nftAmount, nftMinted)
          SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM transfers WHERE transactionHash = ?
          )`;
          db.run(
            insertQuery,
            [
              transactionHash,
              fromAddress,
              toAddress,
              timestamp,
              amount,
              blockNumber,
              1,
              nftAmount,
              0,
              transactionHash,
            ],
            (err) => {
              if (err) {
                console.error(
                  "Error inserting new transfers data into the database",
                  err
                );
              }
            }
          );

          // console.log(`   ${transferId} NFT amount: ${nftAmount}`);
          try {
            await mintNfts({
              transactionHash,
              fromAddress,
              amount,
              nftAmount,
              nftMinted: 0,
              timestamp,
            });
          } catch (error) {
            console.log(`${transferId} ERROR PROCESSING TRANSFER`);
            console.log(error);
          }
        }
      }
      console.log(
        `finish iteration for ${response.data.result.length} transfers`
      );
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
