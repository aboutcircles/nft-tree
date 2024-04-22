"use client";

import Donation from "./donation";
import useDonations from "@/hooks/use-donations";

export default function Donations() {
  const { donors } = useDonations();

  return (
    <div className="w-full flex gap-x-1 lg:flex-col text-xs">
      {donors.map((donor, index) => (
        <Donation key={index} address={donor} />
      ))}
    </div>
  );
}
