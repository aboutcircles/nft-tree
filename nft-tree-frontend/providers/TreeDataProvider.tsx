"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { publicClient } from "@/viem";
import { Address } from "viem";
import circlesTreeABI from "@/utils/abis/CirclesTree";
import {
  Donor,
  NFT,
  Transfer,
  TreeData,
  TreeDataContextType,
} from "@/types/types";

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
  // const [lastEvent, setLastEvent] = useState<number>(0);
  const URL = "https://plankton-app-gvulz.ondigitalocean.app/tree-data";
  // fetch(`${url}?id=${id}`).then((res) => res.json());
  const fetcher = async ([url, id]: [string, number]) => {
    // console.log("fetcher");
    return fetch(`${url}`).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR([URL], fetcher, {
    refreshInterval: 3000,
  });

  const [donors, setDonors] = useState<Donor[]>();
  const [nfts, setNfts] = useState<NFT[]>();
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [branches, setBranches] = useState<string[][]>();
  const [mintingStatus, setMintingStatus] = useState<boolean>();
  const [mintingBranches, setMintingBranches] = useState<string[][]>();

  useEffect(() => {
    if (data) {
      const _donors: Donor[] = [];
      const _nfts: NFT[] = [];
      const _transfers: Transfer[] = [];
      const _branches: string[][] = [];
      const _mintingBranches: string[][] = [];

      data.forEach((item: TreeData) => {
        // Process donors
        _donors.push({
          address: item.address,
          imageUrl: item.imageUrl,
          username: item.username,
          crcAmount: item.crcAmount,
        });

        // Process NFTs
        const nftArray = JSON.parse(item.nftIds);
        if (nftArray.length > 0) {
          nftArray.forEach((nft: { nftId: string; timestamp: number }) => {
            _nfts.push({
              address: item.address,
              imageUrl: item.imageUrl,
              username: item.username,
              nftId: parseInt(nft.nftId),
              timestamp: nft.timestamp.toString(),
            });
          });
        }

        // Process transfers
        const steps = JSON.parse(item.steps) as Transfer[];
        steps.forEach((step) => {
          _transfers.push({
            from: step.from,
            to: step.to,
          });
        });

        // Process branches
        const toSteps = Array.from(
          new Set(steps.reverse().map((step) => step.to))
        );
        toSteps.push(item.address);
        if (nftArray.length > 0) {
          _branches.push(toSteps);
        } else {
          _mintingBranches.push(toSteps);
        }
      });

      // Reverse the arrays to maintain the original order
      setDonors(_donors.reverse());
      setNfts(_nfts.reverse());
      setTransfers(_transfers);
      setBranches(_branches);
      setMintingBranches(_mintingBranches);

      // Update lastId if necessary
      if (data.length > 0 && data[data.length - 1].id > lastId) {
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
        await mutate([URL]);
      },
    });

    return () => unwatch();
  }, [lastId]);

  useEffect(() => {
    const fetchMintingStatus = async () => {
      const response = await fetch(
        "https://plankton-app-gvulz.ondigitalocean.app/minting-status"
      );
      const data = await response.json();
      setMintingStatus(data);
    };

    fetchMintingStatus();

    const intervalId = setInterval(fetchMintingStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const treeData = {
    donors,
    nfts,
    transfers,
    // consolidateTransfer,
    supply: nfts?.length,
    branches,
    mintingStatus,
    mintingBranches,
  };

  return (
    <TreeDataContext.Provider value={treeData}>
      {children}
    </TreeDataContext.Provider>
  );
};
