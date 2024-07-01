import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "../../data/");

interface Transfer {
  from: string;
  to: string;
}

interface Result {
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  cursor: string;
}

async function processAndSaveTransfers() {
  const files = fs.readdirSync(dataDirectory);
  const results: Result[] = [];
  const steps: { [key: string]: { from: string; to: string }[] } = {};
  let txHash = 0;

  for (const file of files) {
    const filePath = path.join(dataDirectory, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (data.transfers && data.transfers.length > 0) {
      const fromAddress = data.transfers[0].from;
      const toAddress = data.transfers[data.transfers.length - 1].to;
      const amounts = [1, 2, 3, 5];
      const baseAmount = 42320273382695450000; // 99.9999 CRC

      const numberOfEntries = Math.random() < 0.5 ? 1 : 3; // Randomly choose to add 1 or 3 entries

      for (let i = 0; i < numberOfEntries; i++) {
        txHash++;
        const result = {
          timestamp: "1713793050",
          blockNumber: "33573243",
          transactionHash: txHash.toString(),
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount:
            baseAmount * amounts[Math.floor(Math.random() * amounts.length)],
          cursor: "33573243-3-3",
        };

        // Insert the result at a random position in the results array
        const insertPosition = Math.floor(Math.random() * (results.length + 1));
        results.splice(insertPosition, 0, result);
      }

      steps[fromAddress] = data.transfers.map((t: Transfer) => {
        return {
          from: t.from,
          to: t.to,
        };
      });
    }
  }

  const transfersFilePath = path.join(
    dataDirectory,
    "../src/testData/transfers.json"
  );
  fs.writeFileSync(transfersFilePath, JSON.stringify(results, null, 2));

  const stepsFilePath = path.join(dataDirectory, "../src/testData/steps.json");
  fs.writeFileSync(stepsFilePath, JSON.stringify(steps, null, 2));

  console.log("Data processed and saved to files");
  console.log("Total transfers number: ", results.length);
}

processAndSaveTransfers();
