"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { publicClient } from "@/viem";
import { Address } from "viem";
import circlesTreeABI from "@/utils/abis/CirclesTree";
// import { consolidateTransfers } from "@/utils/loadDatas";
import {
  Donor,
  NFT,
  Transfer,
  TreeData,
  TreeDataContextType,
} from "@/types/types";
// import { Node } from "@/components/tree";

const circlesTreeAddress = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  "") as Address;

export const TreeDataContext = createContext<TreeDataContextType | undefined>(
  undefined
);

interface TreeDataProviderProps {
  children: React.ReactNode;
}

interface Step {
  from: string;
  to: string;
}

export const TreeDataProvider: React.FC<TreeDataProviderProps> = ({
  children,
}) => {
  const [lastId, setLastId] = useState<number>(0);
  // const [lastEvent, setLastEvent] = useState<number>(0);
  const URL = "https://plankton-app-gvulz.ondigitalocean.app/tree-data";
  // fetch(`${url}?id=${id}`).then((res) => res.json());
  const fetcher = async ([url, id]: [string, number]) => {
    // console.log("fetcher");
    return fetch(`${url}`).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR([URL, lastId], fetcher);

  const [donors, setDonors] = useState<Donor[]>();
  const [nfts, setNfts] = useState<NFT[]>();
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [branches, setBranches] = useState<string[][]>();
  // const [consolidateTransfer, setConsolidateTransfer] = useState<Node[]>();

  useEffect(() => {
    if (data) {
      const _donors: Donor[] = data.map((item: TreeData) => ({
        address: item.address,
        imageUrl: item.imageUrl,
        username: item.username,
        crcAmount: item.crcAmount,
      }));
      setDonors(_donors.reverse());

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
      setNfts(_nfts.reverse());
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

      const _branches: string[][] = data.map((branch: TreeData) => {
        // Parse the JSON string to get the steps array
        const steps: Step[] = JSON.parse(branch.steps);

        // Reverse the steps array and map to get only the 'to' field

        const toSteps = Array.from(
          new Set(steps.reverse().map((step) => step.to))
        );

        // const toSteps = steps.reverse().map((step) => step.to);
        toSteps.push(branch.address);

        return toSteps;
      });

      setBranches(_branches);

      // const _consolidateTransfer = consolidateTransfers(_transfers);
      // setConsolidateTransfer(_consolidateTransfer);

      if (data && data.length > 0 && data[data.length - 1].id > lastId) {
        setLastId(data[data.length - 1].id);
      }
    }
  }, [data, lastId]);

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: circlesTreeAddress,
      abi: circlesTreeABI,
      eventName: "Transfer",
      pollingInterval: 2000,
      onLogs: async (logs) => {
        console.log("logs", logs);
        await mutate([URL, lastId]);
      },
    });

    return () => unwatch();
  }, [lastId]);

  const treeData = {
    donors,
    nfts,
    transfers,
    // consolidateTransfer,
    supply: nfts?.length,
    branches,
  };

  return (
    <TreeDataContext.Provider value={treeData}>
      {children}
    </TreeDataContext.Provider>
  );
};
