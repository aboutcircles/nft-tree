import { ethers } from "ethers";

import { db } from "../database.js";
import { getTransferSteps, getUserData } from "./transferInfo.js";
import convertToHumanCrc from "../utils/convertToHumanCrc.js";
import { getMockTransferSteps } from "./mockData.js";

const erc721ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS || "",
  erc721ABI,
  wallet
);

interface Transfer {
  transactionHash: string;
  fromAddress: string;
  amount: string;
  nftAmount: number;
  nftMinted: number;
  timestamp: string;
}

export async function mintNfts(transfer: Transfer) {
  const toMint = transfer.nftAmount - transfer.nftMinted;
  if (toMint === 0) return;
  let minted = 0;

  const transferId = transfer.transactionHash.slice(-5);

  try {
    const checksumAddress = ethers.getAddress(transfer.fromAddress);

    const nftIds = [];
    for (let i = 0; i < toMint; i++) {
      try {
        const currentNonce = await provider.getTransactionCount(
          wallet.address,
          "pending"
        );

        // console.log(`   ${transferId} nonce: ${currentNonce}`);
        const tx = await contract.safeMint(checksumAddress, {
          nonce: currentNonce,
        });

        console.log(
          `   ${transferId} ${i + 1} of ${toMint} minting started, tx hash: ${
            tx.hash
          }`
        );

        const txReceipt = await provider.waitForTransaction(tx.hash, 3, 30000); // Wait for  confirmations or 30 seconds
        if (!txReceipt) {
          console.log(
            `   ${transferId} Transaction ${tx.hash} is not confirmed...`
          );
          throw new Error("Transaction not confirmed");
        } else {
          console.log(
            `   ${transferId} Transaction ${tx.hash} confirmed in block ${txReceipt.blockNumber}`
          );

          const parsedLog = contract.interface.parseLog(txReceipt.logs[0]);
          const nftId = parsedLog?.args.tokenId.toString();

          const block = await provider.getBlock(txReceipt.blockNumber);
          const timestamp = block?.timestamp;

          console.log(
            `   ${transferId} Token minted successfully with ID: ${nftId}`
          );
          minted++;

          nftIds.push({ nftId, timestamp });
        }
      } catch (error) {
        console.error(
          `   ${transferId} ERROR MINTING TOKEN ${
            i + 1
          } of ${toMint} to ${checksumAddress}`
        );
        console.error(error);
      }
    }

    db.run(
      "UPDATE transfers SET processed = ?, nftMinted = ? WHERE transactionHash = ?",
      [
        minted === toMint ? 1 : 0,
        transfer.nftMinted + minted,
        transfer.transactionHash,
      ]
    );

    if (nftIds.length === 0) {
      `   ${transferId} NO TOKENS WERE MINTED TO ${transfer.fromAddress}`;
      return;
    }

    // const steps = await getTransferSteps(
    //   transfer.transactionHash,
    //   transfer.amount
    // );
    const steps = await getMockTransferSteps(checksumAddress);

    console.log(`   ${transferId} Minted ${nftIds.length} nfts`);

    const senderData = await getUserData(checksumAddress);
    const crcAmount = convertToHumanCrc(transfer.amount, transfer.timestamp);
    const sql = `
          INSERT INTO treeData (nftIds, crcAmount, address, username, imageUrl, steps)
          VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [
      JSON.stringify(nftIds),
      crcAmount,
      checksumAddress,
      senderData?.username || "",
      senderData?.avatarUrl || "",
      JSON.stringify(steps),
    ]);
    console.log(`${transferId} - FINISH`);
  } catch (error) {
    console.error(
      `   ${transferId} ERROR MINTING TOKENS TO ${transfer.fromAddress}`
    );
    console.error(error);
  }
}
