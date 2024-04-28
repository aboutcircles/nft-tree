import db from "../../database.js";
import { mintNfts } from "./mintNfts.js";

// not used anymore

interface Transfer {
  transactionHash: string;
  fromAddress: string;
  amount: string;
  nftAmount: number;
  nftMinted: number;
}

export async function processTransfers(): Promise<void> {
  db.all(
    "SELECT * FROM transfers WHERE processed = 0",
    [],
    async (err, transfers: Transfer[]) => {
      if (err) {
        console.error("Error reading from the database", err);
        return;
      }

      if (transfers.length > 0) {
        console.log("==========================");
        console.log(
          `${new Date().toISOString()} - FOUND ${
            transfers.length
          } NEW TRANSFERS`
        );
      } else {
        // if now new transfers wait 30 seconds before to go to fetch txs again
        await new Promise((resolve) => setTimeout(resolve, 30000)); // 30-second pause
      }

      for (const transfer of transfers) {
        const transferId = transfer.transactionHash.slice(-5);
        console.log("=============");
        console.log(`START - ${transferId}, NFT amount: ${transfer.nftAmount}`);
        try {
          await mintNfts(transfer);
          console.log(`FINISH - ${transferId}`);
        } catch (error) {
          console.log(`${transferId} ERROR PROCESSING TRANSFER`);
          console.log(error);
        }
      }
    }
  );
}
