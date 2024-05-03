import "dotenv/config";
import { processTransfers } from "./processTransfers.js";
import { db } from "../database.js";

const POLLING_INTERVAL = 10000;

const runTasks = async () => {
  try {
    await processTransfers();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    setTimeout(runTasks, POLLING_INTERVAL);
  }
};

runTasks();

process.on("SIGINT", () => {
  db.close((err: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});
