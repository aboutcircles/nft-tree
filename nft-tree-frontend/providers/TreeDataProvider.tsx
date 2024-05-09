"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR from "swr";
import { publicClient } from "@/viem";
import { Address } from "viem";
import circlesTreeABI from "@/utils/abis/CirclesTree";
import { consolidateTransfers } from "@/utils/loadDatas";
import {
  Donor,
  NFT,
  Transfer,
  TreeData,
  TreeDataContextType,
} from "@/types/types";
import { Node } from "@/components/tree";

const circlesTreeAddress = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  "") as Address;

export const TreeDataContext = createContext<TreeDataContextType | undefined>(
  undefined
);

interface TreeDataProviderProps {
  children: React.ReactNode;
}

export const TreeDataProvider: React.FC<TreeDataProviderProps> = ({
  children,
}) => {
  const [lastId, setLastId] = useState<number>(0);
  const URL = "https://plankton-app-gvulz.ondigitalocean.app/tree-data";
  const fetcher = ([url, id]: [string, number]) =>
    fetch(`${url}?id=${id}`).then((res) => res.json());
  const { data, error } = useSWR([URL, lastId], fetcher);

  const [donors, setDonors] = useState<Donor[]>();
  const [nfts, setNfts] = useState<NFT[]>();
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [consolidateTransfer, setConsolidateTransfer] = useState<Node[]>();

  useEffect(() => {
    if (data) {
      const _donors: Donor[] = data.map((item: TreeData) => ({
        address: item.address,
        imageUrl: item.imageUrl,
        username: item.username,
        crcAmount: item.crcAmount,
      }));
      setDonors(_donors);

      const _nfts: NFT[] = data.flatMap((item: TreeData) => {
        const nftArray = JSON.parse(item.nftIds);
        return nftArray.map((nft: { nftId: string; timestamp: number }) => ({
          address: item.address,
          imageUrl: item.imageUrl,
          username: item.username,
          nftId: parseInt(nft.nftId),
          timestamp: nft.timestamp.toString(),
        }));
      });
      setNfts(_nfts);
      const _transfers: Transfer[] = data.reduce(
        (acc: Transfer[], item: TreeData) => {
          const steps = JSON.parse(item.steps) as Transfer[];
          steps.forEach((step) => {
            acc.push({
              from: step.from,
              to: step.to,
            });
          });
          return acc;
        },
        []
      );
      setTransfers(_transfers);

      const _consolidateTransfer = consolidateTransfers(_transfers);
      setConsolidateTransfer(_consolidateTransfer);
    }
  }, [data]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: circlesTreeAddress,
      abi: circlesTreeABI,
      eventName: "Transfer",
      pollingInterval: 2000,
      onLogs: async (logs) => {
        console.log("logs", logs);
        await fetchServerData();
      },
    });

    return () => unwatch();
  }, []);

  const treeData = {
    donors,
    nfts,
    transfers,
    consolidateTransfer,
    supply: nfts?.length,
  };

  return (
    <TreeDataContext.Provider value={treeData}>
      {children}
    </TreeDataContext.Provider>
  );
};
