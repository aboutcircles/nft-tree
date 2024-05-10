import Donation from "./donation";
import { Donor } from "@/actions/fetchDatas";
// import Link from "next/link";

interface DonationsProps {
  donors: Donor[];
  currentDonor: string | null;
  setCurrentDonor: (address: string) => void;
}

export default function Donations({
  donors,
  currentDonor,
  setCurrentDonor,
}: DonationsProps) {
  const handleClick = (address: string) => {
    setCurrentDonor(address);
  };

  return (
    <div className="w-full flex flex-col landscape:min-w-60 landscape:p-4 z-20">
      Recent Donations
      <div className="w-full flex gap-x-1 landscape:flex-col text-xs mt-2">
        {donors.slice(0, 10).map((donor, index) => (
          <div
            key={index}
            className={`${index >= 2 ? "w-full hidden landscape:block" : ""} ${
              currentDonor === donor.address ? "text-green-500" : ""
            }`}
            onClick={() => handleClick(donor.address)}
          >
            <Donation
              key={index}
              address={donor.address}
              imageUrl={donor.imageUrl}
              username={donor.username}
              crcAmount={donor.crcAmount}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
