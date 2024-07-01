"use client";

import { CirclesDataContextType } from "@/types/types";
import { crcToTc } from "@circles/timecircles";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Address, formatEther } from "viem";

// const circlesTreeAddress = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "") as Address;

export const CirclesDataContext = createContext<CirclesDataContextType | undefined>(undefined);

interface CirclesRpcProviderProps {
  children: React.ReactNode;
}

function roundToNearest(number: number, decimals: number = 0) {
  const factor = Math.pow(10, decimals);
  console.log((number * factor) / factor);
  return Math.round(Math.ceil(number * factor) / factor / 10) * 10;
}

const convertToHumanCrc = (crcAmountInWei: string, timestamp: string) => {
  const crcAmount = Number(formatEther(BigInt(crcAmountInWei)));
  const tcAmount = crcToTc(Number(timestamp) * 1000, crcAmount);

  return roundToNearest(tcAmount);
};

export const CirclesDataProvider: React.FC<CirclesRpcProviderProps> = ({ children }) => {
  const [circlesAmount, setCirclesAmount] = useState(0);

  const fetchRealData = async () => {
    const response = await axios.post(
      "https://circles-rpc.aboutcircles.com/",
      {
        jsonrpc: "2.0",
        method: "circles_getTotalBalance",
        params: ["0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811"],
        id: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching circles amount...");
      const data = await fetchRealData();
      setCirclesAmount(convertToHumanCrc(data.data.result, (Date.now() / 1000).toString()));
    };

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const circlesData = { circlesAmount };

  return <CirclesDataContext.Provider value={circlesData}>{children}</CirclesDataContext.Provider>;
};
