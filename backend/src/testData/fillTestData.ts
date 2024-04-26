import fs from "fs";
import path from "path";
import db from "./testDatabase.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "../../data/");
let nftId = 1; // Initialize nftId

fs.readdir(dataDirectory, (err, files) => {
  if (err) {
    console.error("Error reading the data directory:", err);
    return;
  }

  files.forEach((file, index) => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(dataDirectory, file);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }
        interface TransferStep {
          from: string;
          to: string;
        }

        const jsonData = JSON.parse(data);
        const transfers = jsonData.transfers.map((step: TransferStep) => ({
          from: step.from,
          to: step.to,
        }));
        const firstAddress = jsonData.transfers[0]?.from || "";
        const username = `name${index + 1}`;
        const imageUrl = "";
        const steps = JSON.stringify(transfers);

        // Insert into the database
        db.run(
          `INSERT INTO treeData (nftId, address, username, imageUrl, steps)
          SELECT ?, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM treeData WHERE nftId = ?
          )`,
          [nftId, firstAddress, username, imageUrl, steps, nftId],
          (err) => {
            if (err) {
              console.error("Failed to insert data into treeData table", err);
            } else {
              console.log(
                `Successfully inserted or confirmed existence of nftId ${nftId}`
              );
            }
          }
        );

        console.log({ nftId, firstAddress, username, imageUrl, steps });

        nftId++; // Increment nftId for the next file
      });
    }
  });
});
