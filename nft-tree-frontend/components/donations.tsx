import Donation from "./donation";
import { Donor } from "@/actions/fetchDatas";
import Link from "next/link";

interface DonationsProps {
  donors: Donor[];
}

export default function Donations({ donors }: DonationsProps) {
  return (
    <div className="w-full flex flex-col landscape:min-w-60 landscape:p-4">
      Recent Donations
      <div className="w-full flex gap-x-1 landscape:flex-col text-xs mt-2">
        {donors.slice(0, 10).map((donor, index) => (
          <div key={index} className={`${index >= 2 ? "w-full hidden landscape:block" : ""}`}>
            <Donation key={index} address={donor.address} imageUrl={donor.imageUrl} username={donor.username} nftId={donor.nftId} updatedAt={donor.updatedAt} />
          </div>
        ))}
      </div>
    </div>
  );
}
