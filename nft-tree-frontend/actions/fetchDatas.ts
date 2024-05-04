"use server";

import { consolidateTransfers, loadAllData } from "@/utils/loadDatas";
import { readdir } from "fs/promises";
import path from "path";
import { Address } from "viem";

type TreeData = {
  id: number;
  nftId: string;
  address: Address;
  username: string;
  imageUrl: string;
  steps: string;
  updatedAt: string;
};

type Transfer = {
  from: Address;
  to: Address;
};

export type Donor = {
  address: Address;
  imageUrl: string;
  username: string;
  nftId: number;
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
  const res = await fetch("https://tree-server-test.onrender.com/tree-test");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const dataArray: TreeData[] = await res.json();

  const donors: Donor[] = dataArray.map((item) => {
    return {
      address: item.address,
      imageUrl: item.imageUrl,
      username: item.username,
      nftId: Number(item.nftId),
    };
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

  return { consolidateTransfer, donors, supply: dataArray.length };
}
