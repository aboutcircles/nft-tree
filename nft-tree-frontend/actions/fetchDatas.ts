"use server";

import { consolidateTransfers, loadAllData } from "@/utils/loadDatas";
import { readdir } from "fs/promises";
import path from "path";
import { Address } from "viem";

type TreeData = {
  id: number;
  nftIds: string;
  crcAmount: string;
  address: Address;
  username: string;
  imageUrl: string;
  steps: string;
};

type Transfer = {
  from: Address;
  to: Address;
};

export type Donor = {
  address: Address;
  imageUrl: string;
  username: string;
  crcAmount: string;
};

export type NFT = {
  address: Address;
  imageUrl: string;
  username: string;
  nftId: number;
  timestamp: string;
};

export async function fetchFilesData() {
  try {
    const dataDirectory = path.join(process.cwd(), "/utils/data");
    const filenames = await readdir(dataDirectory);
    const allTransfers = await loadAllData(filenames);
    return consolidateTransfers(allTransfers);
  } catch (error) {
    console.error("Failed to read file:", error);
    throw new Error("Failed to load data");
  }
}

export async function fetchServerData() {
  const res = await fetch("https://plankton-app-gvulz.ondigitalocean.app/tree-data");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const dataArray: TreeData[] = await res.json();

  const donors: Donor[] = dataArray.map((item) => {
    return {
      address: item.address,
      imageUrl: item.imageUrl,
      username: item.username,
      crcAmount: item.crcAmount,
    };
  });

  const nfts: NFT[] = dataArray.flatMap((item) => {
    const nftArray = JSON.parse(item.nftIds);
    return nftArray.map((nft: { nftId: string; timestamp: number }) => ({
      address: item.address,
      imageUrl: item.imageUrl,
      username: item.username,
      nftId: parseInt(nft.nftId),
      timestamp: nft.timestamp.toString(),
    }));
  });

  const transfers: Transfer[] = dataArray.reduce((acc, item) => {
    const steps = JSON.parse(item.steps) as Transfer[];
    steps.forEach((step) => {
      acc.push({
        from: step.from,
        to: step.to,
      });
    });
    return acc;
  }, [] as Transfer[]);

  const consolidateTransfer = consolidateTransfers(transfers);

  return { consolidateTransfer, donors, nfts, supply: dataArray.length };
}
