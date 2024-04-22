import circlesTreeABI from "@/utils/abis/CirclesTree";
import { publicClient } from "@/viem";
import { useEffect, useState } from "react";
import { Address } from "viem";

function useDonations() {
  const [totalSupply, setTotalSupply] = useState(0);
  const [donors, setDonors] = useState<Address[]>(["0x3246012BC7c9Bf13Dc00166Cf969467Ef93bf7E5", "0xB72b9865a922305Af83803472d6054d4488B9Cc4", "0x0ea8f917a20D33F133aad1189eAE3B4d5601fC19"]);

  useEffect(() => {
    async function fetchTotalSupply() {
      try {
        const result = await publicClient.readContract({
          address: "0x0",
          abi: circlesTreeABI,
          functionName: "totalSupply",
        });
        setTotalSupply(result);
      } catch (error) {
        console.log("Failed to fetch total supply", error);
      }
    }

    fetchTotalSupply();
  }, []);

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: "0x0",
      abi: circlesTreeABI,
      eventName: "Transfer",
      pollingInterval: 2000,
      onLogs: (logs) => {
        setDonors((prevDonors) => {
          const newDonors = [...prevDonors];
          logs.forEach((log) => {
            if (log.args.from && !prevDonors.includes(log.args.from)) {
              newDonors.push(log.args.from);
            }
          });
          return newDonors;
        });
      },
    });

    return () => unwatch();
  }, []);

  return { totalSupply, donors };
}

export default useDonations;
