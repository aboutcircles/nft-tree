import circlesTreeABI from "@/utils/abis/CirclesTree";
import { publicClient } from "@/viem";
import { useState } from "react";
import { Address } from "viem";
import Donation from "./donation";

export default function Donations() {
  const [donors, setDonors] = useState<Address[]>([]);
  const unwatch = publicClient.watchContractEvent({
    address: "0x0",
    abi: circlesTreeABI,
    eventName: "Transfer",
    onLogs: (logs) => {
      let donorsTemp = donors;
      logs.forEach((log) => {
        if (log.args.from) donorsTemp.push(log.args.from);
      });
      setDonors(donorsTemp);
    },
  });

  return (
    <div className="h-full">
      {donors.map((donor, index) => (
        <Donation key={index} address={donor} />
      ))}
    </div>
  );
}
