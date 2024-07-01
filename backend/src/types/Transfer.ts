interface Transfer {
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  amount: string;
  crcAmount: string;
  blockNumber: string;
  processed: boolean;
  nftAmount: number;
  nftMinted: number;
}

export type { Transfer };
