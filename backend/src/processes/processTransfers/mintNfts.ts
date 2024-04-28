import { ethers } from "ethers";

import db from "../../database.js";
import { getTransferSteps, getUserData } from "./transferInfo.js";

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
}

interface TransferEvent {
  event: string;
  args: {
    from: string;
    to: string;
    tokenId: string;
  };
}

export async function mintNfts(transfer: Transfer) {
  const toMint = transfer.nftAmount - transfer.nftMinted;
  if (toMint === 0) return;
  let minted = 0;

  const transferId = transfer.transactionHash.slice(-5);

  try {
    // // Update the database to mark the transfer as processed
    // db.run("UPDATE transfers SET processed = 1 WHERE transactionHash = ?", [
    //   transfer.transactionHash,
    // ]);

    const steps = await getTransferSteps(
      transfer.transactionHash,
      transfer.amount
    );
    const checksumAddress = ethers.getAddress(transfer.fromAddress);
    const senderData = await getUserData(checksumAddress);

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
          `   ${transferId} ${
            i + 1
          } of ${toMint} minting started, waiting for receipt`
        );
        console.log(`   ${transferId} Minting tx hash: ${tx.hash}`);

        const txReceipt = await provider.waitForTransaction(tx.hash, 3, 30000); // Wait for 5 confirmations or 30 seconds
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
          const tokenId = parsedLog?.args.tokenId.toString();

          console.log(
            `   ${transferId} Token minted successfully with ID: ${tokenId}`
          );
          minted++;

          const sql = `
          INSERT INTO treeData (nftId, address, username, imageUrl, steps)
          VALUES (?, ?, ?, ?, ?)`;
          db.run(sql, [
            tokenId,
            checksumAddress,
            senderData.username,
            senderData.avatarUrl,
            JSON.stringify(steps),
          ]);

          // console.log(
          //   `   ${transferId} Successfully inserted token ID ${tokenId} into the database.`
          // );
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
  } catch (error) {
    console.error(
      `   ${transferId} ERROR MINTING TOKENS TO ${transfer.fromAddress}`
    );
    console.error(error);
  }
}
