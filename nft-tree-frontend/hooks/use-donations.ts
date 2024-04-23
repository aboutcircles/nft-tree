import circlesTreeABI from "@/utils/abis/CirclesTree";
import { publicClient } from "@/viem";
import { useEffect, useState } from "react";
import { Address } from "viem";

function useDonations() {
  const [totalSupply, setTotalSupply] = useState(0);
  const [donors, setDonors] = useState<Address[]>([]);

  useEffect(() => {
    async function fetchTotalSupply() {
      try {
        const result = await publicClient.readContract({
          address: "0x992d9e030fF8187F950298f89Fb52745764bdEEF",
          abi: circlesTreeABI,
          functionName: "totalSupply",
        });
        setTotalSupply(Number(result));
      } catch (error) {
        console.log("Failed to fetch total supply", error);
      }
    }

    fetchTotalSupply();
  }, [donors]);

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: "0x992d9e030fF8187F950298f89Fb52745764bdEEF",
      abi: circlesTreeABI,
      eventName: "Transfer",
      pollingInterval: 2000,
      onLogs: (logs) => {
        setDonors((prevDonors) => {
          const newDonors = [...prevDonors];
          logs.forEach((log) => {
            if (log.args.to && !prevDonors.includes(log.args.to)) {
              newDonors.push(log.args.to);
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
