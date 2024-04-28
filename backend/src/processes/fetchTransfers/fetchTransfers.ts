import axios from "axios";
import db from "../../database.js";
import { ethers } from "ethers";
import { crcToTc } from "@circles/timecircles";
import { mintNfts } from "../processTransfers/mintNfts.js";

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

    // const response = {
    //   data: {
    //     result: [
    //       {
    //         timestamp: "1713793050",
    //         blockNumber: "33573243",
    //         transactionHash:
    //           "0x584a5442301cfd5a4db940d709c75e9971044c6f20af80272d23ed10a69f9b2b",
    //         fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
    //         toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
    //         amount: "4232027253759994",
    //         cursor: "33573243-3-3",
    //       },
    //       {
    //         timestamp: "1713887530",
    //         blockNumber: "33591446",
    //         transactionHash:
    //           "0x50323d2d3db5f11219c13b36c5dff94875528a245ca9cd9c9cfaee02f0bb77f0",
    //         fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
    //         toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
    //         amount: "4232883036903554",
    //         cursor: "33591446-0-3",
    //       },
    //       {
    //         timestamp: "1713890950",
    //         blockNumber: "33592106",
    //         transactionHash:
    //           "0x92571ac2318615d139853daaf606ac54d3687c072a9381c3e736cbe86f2e958c",
    //         fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
    //         toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
    //         amount: "4232913965497125",
    //         cursor: "33592106-9-3",
    //       },
    //       {
    //         timestamp: "1713891210",
    //         blockNumber: "33592158",
    //         transactionHash:
    //           "0xeb372b30751cde47b4ce664eb28d1adb3089c212d2f8bc6e7bcf0f0c0ac8391d",
    //         fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
    //         toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
    //         amount: "4232916341764401",
    //         cursor: "33592158-6-3",
    //       },
    //       {
    //         timestamp: "1713973340",
    //         blockNumber: "33608029",
    //         transactionHash:
    //           "0x2107052d3015732149c0cc9cd2aca386e685b860d936c80a4c8e0f521ebbabb3",
    //         fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
    //         toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
    //         amount: "423366028819257100",
    //         cursor: "33608029-23-3",
    //       },
    //     ],
    //   },
    // };

    if (response.data && response.data.result) {
      for (const transfer of response.data.result) {
        const {
          transactionHash,
          fromAddress,
          toAddress,
          timestamp,
          amount,
          blockNumber,
        } = transfer;

        const transferExists = await checkIfTransferExists(transactionHash);
        if (transferExists) continue;

        const transferId = transactionHash.slice(-5);

        console.log("✨✨✨🚀");
        console.log(`${transferId} - FOUND NEW TRANSFER FROM ${fromAddress}`);

        const nftAmount = getNftAmount(amount, timestamp);

        // TODO check if total nft amount for address not more than 3
        // and maybe save info about donations not eligible for NFT minting

        if (nftAmount > 0) {
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
        }

        console.log(`   ${transferId} NFT amount: ${nftAmount}`);
        try {
          await mintNfts({
            transactionHash,
            fromAddress,
            amount,
            nftAmount,
            nftMinted: 0,
          });
          console.log(`${transferId} - FINISH`);
        } catch (error) {
          console.log(`${transferId} ERROR PROCESSING TRANSFER`);
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
