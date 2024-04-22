"use client";

import circlesTreeABI from "@/utils/abis/CirclesTree";
import { publicClient } from "@/viem";
import { useState } from "react";
import { Address } from "viem";
import Donation from "./donation";

export default function Donations() {
  const [donors, setDonors] = useState<Address[]>(["0x3246012BC7c9Bf13Dc00166Cf969467Ef93bf7E5", "0xB72b9865a922305Af83803472d6054d4488B9Cc4", "0x0ea8f917a20D33F133aad1189eAE3B4d5601fC19"]);
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
    <div className="w-full flex gap-x-1 lg:flex-col text-xs">
      {donors.map((donor, index) => (
        <Donation key={index} address={donor} />
      ))}
    </div>
  );
}
