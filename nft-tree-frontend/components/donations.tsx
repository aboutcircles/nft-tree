import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Donation from "./donation";
import { Donor } from "@/actions/fetchDatas";
import Link from "next/link";

interface DonationsProps {
  donors: Donor[];
}

export default function Donations({ donors }: DonationsProps) {
  return (
    <div className="w-full flex flex-col landscape:min-w-60 landscape:p-4">
      <Link className="w-full flex items-center mb-2" href={"/dashboard"}>
        Recent Donations
        <ArrowRightIcon width={20} height={20} className="ml-1" />
      </Link>
      <div className="w-full flex gap-x-1 landscape:flex-col text-xs">
        {donors.slice(0, 10).map((donor, index) => (
          <div key={index} className={`${index >= 2 ? "w-full hidden landscape:block" : ""}`}>
            <Donation key={index} address={donor.address} imageUrl={donor.imageUrl} username={donor.username} />
          </div>
        ))}
      </div>
    </div>
  );
}
