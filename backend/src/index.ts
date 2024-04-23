import 'dotenv/config';
import { fetchData } from './fetchData.js';
import { processTransfers } from './processTransfers.js';

const POLLING_INTERVAL = 10000; // Polling interval in milliseconds (e.g., 10000ms = 10 seconds)

const runTasks = async () => {
  try {
    await fetchData()
    await processTransfers()
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

setInterval(runTasks, POLLING_INTERVAL);
