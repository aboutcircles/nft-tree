import { ethers } from "ethers";
import db from "../../database.js";
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
    from: string;
    to: string;
    tokenId: string;
  };
}

export async function mintNfts(transfer: Transfer) {
  const toMint = transfer.nftAmount - transfer.nftMinted;
  if (toMint === 0) return;
  let minted = 0;

  try {
    // Update the database to mark the transfer as processed
    db.run("UPDATE transfers SET processed = 1 WHERE transactionHash = ?", [
      transfer.transactionHash,
    ]);

    const steps = await getTransferSteps(
      transfer.transactionHash,
      transfer.amount
    );
    const checksumAddress = ethers.getAddress(transfer.fromAddress);
    const senderData = await getUserData(checksumAddress);

    let currentNonce = await provider.getTransactionCount(
      wallet.address,
      "pending"
    );

    for (let i = 0; i < toMint; i++) {
      currentNonce++;

      const gasPrice =
        ((await provider.getFeeData()).gasPrice ||
          ethers.parseUnits("4", "gwei")) +
        ethers.parseUnits(String(i), "gwei");

      const estimatedGasLimit = await contract.safeMint.estimateGas(
        checksumAddress,
        {
          nonce: currentNonce,
          gasPrice: gasPrice,
        }
      );
      const adjustedGasLimit = estimatedGasLimit + BigInt(1000 * i);

      try {
        const tx = await contract.safeMint(checksumAddress, {
          nonce: currentNonce,
          gasPrice: gasPrice,
          gasLimit: adjustedGasLimit,
        });

        console.log("   MINTING STARTED, WAITING FOR RECEIPT");
        console.log("   Transaction Hash:", tx.hash);

        // Handling the case where the receipt might never come
        const receipt = await Promise.race([
          tx.wait(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Receipt timeout")), 30000)
          ),
        ]);

        const transferEvent = receipt.events?.find(
          (event: TransferEvent) => event.event === "Transfer"
        );
        const tokenId = transferEvent?.args?.tokenId;
        // const tokenId = "108";

        console.log("   Token minted successfully with ID:", tokenId);
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

        console.log(
          `   Successfully inserted token ID ${tokenId} into the database.`
        );
      } catch (error) {
        console.error("   ERROR MINTING TOKEN TO", checksumAddress);
        console.error(error);
      }
    }

    console.log(`   RESULT`, minted);
    console.log("processed", minted === toMint);
    console.log("nftMinted", transfer.nftMinted + minted);
    console.log("toMint", transfer.nftAmount);

    db.run(
      "UPDATE transfers SET processed = ?, nftMinted = ? WHERE transactionHash = ?",
      [
        minted === toMint ? 1 : 0,
        transfer.nftMinted + minted,
        transfer.transactionHash,
      ]
    );
  } catch (error) {
    console.error(`   ERROR MINTING TOKENS TO ${transfer.fromAddress}`);
    console.error(error);
  }
}
