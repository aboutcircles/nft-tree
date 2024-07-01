import mockTransfers from "./testData/transfers.json" assert { type: "json" };
import convertToHumanCrc from "./utils/convertToHumanCrc.js";
import getNftAmount from "./utils/getNftAmount.js";

const controlAmounts = () => {
  for (const transfer of mockTransfers) {
    console.log("");
    console.log("transfer", transfer.transactionHash);
    console.log("timestamp", transfer.timestamp);
    console.log("amount", transfer.amount);
    const crcAmount = convertToHumanCrc(
      String(transfer.amount),
      String(transfer.timestamp)
    );
    console.log("crcAmount", crcAmount);
    const nftAmount = getNftAmount(crcAmount);
    console.log("nftAmount", nftAmount);
  }
};

controlAmounts();
