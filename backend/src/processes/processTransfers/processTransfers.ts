import db from "../../database.js";
import { mintNfts } from "./mintNfts.js";

export async function processTransfers(): Promise<void> {
  db.all(
    "SELECT * FROM transfers WHERE processed = 0",
    [],
    (err, transfers) => {
      if (err) {
        console.error("Error reading from the database", err);
        return;
      }

      if (transfers.length > 0) {
        console.log("=============");
        console.log("=============");
        console.log(
          `${new Date().toISOString()} - FOUND ${
            transfers.length
          } NEW TRANSFERS`
        );
      }

      transfers.forEach(async (transfer: any) => {
        console.log("=============");
        console.log("PROCESSING TRANSFER");
        console.log(`   txHash: ${transfer.transactionHash}`);

        try {
          await mintNfts(transfer);
        } catch (error) {
          console.log("   ERROR PROCESSING TRANSFER", transfer.transactionHash);
          console.log(error);
        }
      });
    }
  );
}
