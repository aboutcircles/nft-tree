import "dotenv/config";
import { processTransfers } from "./processTransfers.js";
import { db } from "../db/models/index.js";

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
  db.sequelize
    .close()
    .then(() => {
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
});
