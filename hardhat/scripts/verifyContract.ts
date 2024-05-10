import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const network = 'gnosis';
const contractAddress = process.env.CONTRACT_ADDRESS;
const minterAddress = process.env.MINTER_ADDRESS;
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;

if (!contractAddress) {
  console.error('ERROR: CONTRACT_ADDRESS must be defined in the environment.');
  process.exit(1);
}

const command = `npx hardhat verify --network ${network} ${contractAddress} ${minterAddress} ${startTime} ${endTime}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
