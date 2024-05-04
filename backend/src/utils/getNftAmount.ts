import convertToHumanCrc from "./convertToHumanCrc.js";
import dotenv from "dotenv";

dotenv.config();

const getNftAmount = (crcAmountInWei: string, timestamp: string) => {
  const tcAmount = convertToHumanCrc(crcAmountInWei, timestamp);
  const nftAmount = Math.trunc(tcAmount / Number(process.env.NFT_COST_CRC));

  if (nftAmount < 3) {
    return nftAmount;
  } else {
    return 3;
  }
};

export default getNftAmount;
