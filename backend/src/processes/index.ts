import "dotenv/config";
import { fetchTransfers } from "./fetchTransfers/fetchTransfers.js";
import { processTransfers } from "./processTransfers/processTransfers.js";
import db from "../database.js";

const POLLING_INTERVAL = 10000; // Polling interval in milliseconds (e.g., 10000ms = 10 seconds)

const runTasks = async () => {
  try {
    await fetchTransfers();
    await processTransfers();
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

setInterval(runTasks, POLLING_INTERVAL);

process.on("SIGINT", () => {
  db.close((err: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});
