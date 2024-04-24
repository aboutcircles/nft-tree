import circlesTreeABI from "@/utils/abis/CirclesTree";
import { publicClient } from "@/viem";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";

const BLOCK_RANGE_SIZE = 50000;
const SMART_CONTRACT_BLOCK = BigInt(33595668);
const circlesTreeAddress = "0x564a69708A19F8e6842E2484b2de4fadEdA9b315";

function useDonations() {
  const [totalSupply, setTotalSupply] = useState(0);
  const [donors, setDonors] = useState<Address[]>([]);

  useEffect(() => {
    async function fetchTotalSupply() {
      try {
        const result = await publicClient.readContract({
          address: circlesTreeAddress,
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

  const fetchMints = useCallback(async () => {
    const toBlock = await publicClient.getBlockNumber();
    let fromBlock = SMART_CONTRACT_BLOCK;
    let allEvents = [];

    while (fromBlock <= toBlock) {
      const nextBlock = fromBlock + BigInt(BLOCK_RANGE_SIZE) > toBlock ? toBlock : fromBlock + BigInt(BLOCK_RANGE_SIZE);
      const events = await publicClient.getContractEvents({
        abi: circlesTreeABI,
        address: circlesTreeAddress,
        eventName: "Transfer",
        fromBlock: fromBlock,
        toBlock: nextBlock,
      });

      allEvents.push(...events);
      fromBlock = nextBlock + BigInt(1);
    }

    const newDonors = allEvents.map((event) => event.args.to).filter((to) => to !== undefined) as Address[];
    setDonors(newDonors);
  }, []);

  useEffect(() => {
    fetchMints();
  }, [fetchMints]);

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: circlesTreeAddress,
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
