import dotenv from 'dotenv';
dotenv.config();

const getNftAmount = (crcAmount: number) => {
  console.log('crcAmount', crcAmount);
  console.log('NFT_COST_CRC', process.env.NFT_COST_CRC);
  const nftAmount = Math.trunc(crcAmount / Number(process.env.NFT_COST_CRC));
  console.log('nftAmount', nftAmount);

  if (nftAmount < 1) {
    return nftAmount;
  } else {
    return 1;
  }
};

export default getNftAmount;
