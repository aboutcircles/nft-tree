import { ethers } from "ethers";
import { crcToTc } from "@circles/timecircles";

function roundToNearest(number: number, decimals: number = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
}

const convertToHumanCrc = (crcAmountInWei: string, timestamp: string) => {
  const crcAmount = Number(ethers.formatEther(crcAmountInWei.toString()));
  const tcAmount = crcToTc(Number(timestamp) * 1000, crcAmount);

  if (Number(process.env.NFT_COST_CRC) < 1) {
    return roundToNearest(tcAmount, 2); // only for test
  }
  return roundToNearest(tcAmount);
};

export default convertToHumanCrc;
