import db from './database.js';

import { ethers } from 'ethers';

const erc721ABI = [
  "function safeMint(address to) external"
];

async function mintToken(transfer: any) {
  console.log('Minting token for transfer:', transfer.transactionHash);

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
  const contract = new ethers.Contract(transfer.contractAddress, erc721ABI, wallet);

  try {
    const tx = await contract.safeMint(transfer.addressFrom);
    console.log('Minting transaction sent:', tx.hash);
    await tx.wait();
    console.log('Token minted successfully');
  } catch (error) {
    console.error('Error minting token:', error);
  }
}

export async function processTransfers(): Promise<void> {
  db.all('SELECT * FROM transfers WHERE processed = 0', [], (err, transfers) => {
    if (err) {
      console.error('Error reading from the database', err);
      return;
    }

    if (transfers.length > 0) {
      console.log(`Found ${transfers.length} new transfers`);
    }

    transfers.forEach(async (transfer: any) => {
      console.log('Processing transfer:', transfer.transactionHash);
      try {
        await mintToken(transfer)
      
        db.run('UPDATE transfers SET processed = 1 WHERE transactionHash = ?', [transfer.transactionHash], (err) => {
          if (err) {
            console.error('Error updating record', err);
          }
        });

      } catch (error) {
          
      }
    });
  });
}
