import { Address } from "viem";
import { Node } from "@/components/tree";

export type TreeData = {
  id: number;
  nftIds: string;
  crcAmount: string;
  address: Address;
  username: string;
  imageUrl: string;
  steps: string;
};

export type Transfer = {
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

export type NftIds = {
  nftId: string;
  timestamp: number;
};

export type Step = {
  from: Address;
  to: Address;
};

export type TreeItem = {
  id: number;
  nftIds: NftIds[];
  crcAmount: string;
  address: Address;
  username: string;
  imageUrl: string;
  steps: Step[];
};

export type TreeDataContextType = {
  donors: Donor[] | undefined;
  nfts: NFT[] | undefined;
  transfers: Transfer[] | undefined;
  supply: number | undefined;
  branches: string[][] | undefined;
  // consolidateTransfer: Node[] | undefined;
};
