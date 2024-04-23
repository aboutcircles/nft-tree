import db from './database.js';
import { ethers } from 'ethers';

const erc721ABI = [
  "function safeMint(address to) external"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
const contract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS || '', erc721ABI, wallet);

export async function processTransfers(): Promise<void> {
  let currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
  db.all('SELECT * FROM transfers WHERE processed = 0', [], (err, transfers) => {
    if (err) {
      console.error('Error reading from the database', err);
      return;
    }

    if (transfers.length > 0) {
      console.log('=============')
      console.log('=============')
      console.log(`${new Date().toISOString()} - FOUND ${transfers.length} NEW TRANSFERS`);
    }

    transfers.forEach(async (transfer: any) => {
      console.log('=============')
      console.log('PROCESSING TRANSFER');
      console.log(`   txHash: ${transfer.transactionHash}`)
      
      try {
        db.run('UPDATE transfers SET processed = 1 WHERE transactionHash = ?', [transfer.transactionHash], (err) => {
          if (err) {
            console.error('   Error updating record', err);
          }
        });

        try {
          console.log('   MINTING TOKEN')
          console.log(`   to ${transfer.fromAddress}`)
          currentNonce++
          // console.log('   nonce:', currentNonce)
          const tx = await contract.safeMint(transfer.fromAddress, { nonce: currentNonce });
          // const tx = await contract.safeMint(transfer.fromAddress);
          console.log('   Minting transaction sent:', tx.hash);
          await tx.wait();
          console.log('   Token minted successfully');
        } catch (error) {
          console.log('   ERROR MINTING TOKEN TO', transfer.fromAddress)
          console.log(error)
          db.run('UPDATE transfers SET processed = 0 WHERE transactionHash = ?', [transfer.transactionHash], (err) => {
            if (err) {
              console.error('Error updating record', err);
            }
          });
        }
      } catch (error) {
        console.log('   ERROR PROCESSING TRANSFER', transfer.transactionHash)
        console.log(error)
      }
    });
  });
}
