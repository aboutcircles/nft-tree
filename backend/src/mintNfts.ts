import { ethers } from "ethers";
import db from "./database.js";
import { getTransferSteps, getUserData } from "./transferInfo.js";

const erc721ABI = ["function safeMint(address to) external"];
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
    tokenId: string;
  };
}

export async function mintNfts(transfer: Transfer) {
  const toMint = transfer.nftAmount - transfer.nftMinted;
  if (toMint === 0) return;

  // set as Processed for not to mint 2nd time
  db.run(
    "UPDATE transfers SET processed = 1 WHERE transactionHash = ?",
    [transfer.transactionHash],
    (err) => {
      if (err) {
        console.error("   Error updating record", err);
      }
    }
  );

  const steps = await getTransferSteps(
    transfer.transactionHash,
    transfer.amount
  );
  const senderData = await getUserData(transfer.fromAddress);

  let minted = 0;
  let currentNonce = await provider.getTransactionCount(
    wallet.address,
    "pending"
  );
  for (let i = 0; i < toMint; i++) {
    try {
      console.log(`   MINTING TOKEN ${i + 1} of ${toMint}`);
      console.log(`   to ${transfer.fromAddress}`);
      currentNonce++;
      const tx = await contract.safeMint(transfer.fromAddress, {
        nonce: currentNonce,
      });
      const receipt = await tx.wait();
      const transferEvent = receipt.events?.find(
        (event: TransferEvent) => event.event === "Transfer"
      );
      const tokenId = transferEvent?.args?.tokenId;
      console.log("   Token minted successfully with ID:", tokenId);

      const sql = `
        INSERT INTO treeData (nftId, address, username, imageUrl, steps)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(
        sql,
        [
          tokenId,
          transfer.fromAddress,
          senderData.username,
          senderData.avatarUrl,
          JSON.stringify(steps),
        ],
        (err) => {
          if (err) {
            console.error("Failed to insert data into treeData table", err);
          }
        }
      );

      minted++;
    } catch (error) {
      console.log("   ERROR MINTING TOKEN TO", transfer.fromAddress);
      console.log(error);
    }
  }

  db.run(
    "UPDATE transfers SET processed = ?, nftMinted = ? WHERE transactionHash = ?",
    [
      minted === toMint ? 1 : 0, // processed false if not all NFTs minted
      transfer.nftMinted + minted,
      transfer.transactionHash,
    ],
    (err) => {
      if (err) {
        console.error("   Error updating transfers table", err);
      }
    }
  );
}
