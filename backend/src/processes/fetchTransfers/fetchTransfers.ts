import axios from "axios";
import db from "../../database.js";
import { ethers } from "ethers";
import { crcToTc } from "@circles/timecircles";

const getNftAmount = (crcAmountInWei: string, timestamp: string) => {
  const crcAmount = Number(ethers.formatEther(crcAmountInWei.toString()));
  const tcAmount = crcToTc(Number(timestamp) * 1000, crcAmount);

  const nftAmount = Math.trunc(tcAmount / Number(process.env.NFT_COST_CRC));

  if (nftAmount < 3) {
    return nftAmount;
  } else {
    return 3;
  }
};

export async function fetchTransfers(): Promise<void> {
  try {
    const response = await axios.post(
      "https://circles-rpc.circlesubi.id/",
      {
        jsonrpc: "2.0",
        method: "circles_queryHubTransfers",
        params: [
          {
            ToAddress: process.env.DONATION_ADDRESS,
          },
        ],
        id: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.result) {
      response.data.result.forEach((transfer: any) => {
        const {
          transactionHash,
          fromAddress,
          toAddress,
          timestamp,
          amount,
          blockNumber,
        } = transfer;

        const nftAmount = getNftAmount(amount, timestamp);

        // TODO check if total nft amount for address not more than 3
        // and maybe save info about donations not eligible for NFT minting

        if (nftAmount > 0) {
          const insertQuery = `
          INSERT INTO transfers (transactionHash, fromAddress, toAddress, timestamp, amount, blockNumber, nftAmount, nftMinted)
          SELECT ?, ?, ?, ?, ?, ?, ?, ?
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
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
