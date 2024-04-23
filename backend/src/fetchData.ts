import axios from 'axios';
import db from './database.js';

export async function fetchData(): Promise<void> {
  try {
    const response = await axios.post('https://circles-rpc.circlesubi.id/', {
      jsonrpc: '2.0',
      method: 'circles_queryHubTransfers',
      params: [{
        'ToAddress': process.env.DONATION_ADDRESS
      }],
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.result) {
      response.data.result.forEach((transfer: any) => {
        const { transactionHash, fromAddress, toAddress, timestamp, amount, blockNumber } = transfer;
        const insertQuery = `
          INSERT INTO transfers (transactionHash, fromAddress, toAddress, timestamp, amount, blockNumber)
          SELECT ?, ?, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM transfers WHERE transactionHash = ?
          )`;
        db.run(insertQuery,
          [transactionHash, fromAddress, toAddress, timestamp, amount, blockNumber, transactionHash], (err) => {
            if (err) {
              console.error('Error inserting data into the database', err);
            }
          });
      });
    }
  } catch (error) {
    console.error('Error fetching data', error);
  }
}
