import "dotenv/config";
import { fetchTransfers } from "./fetchTransfers.js";
import { processTransfers } from "./processTransfers.js";

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
