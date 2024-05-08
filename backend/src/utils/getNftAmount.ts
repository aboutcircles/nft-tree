import dotenv from "dotenv";
dotenv.config();

const getNftAmount = (crcAmount: number) => {
  const nftAmount = Math.trunc(crcAmount / Number(process.env.NFT_COST_CRC));

  if (nftAmount < 3) {
    return nftAmount;
  } else {
    return 3;
  }
};

export default getNftAmount;
