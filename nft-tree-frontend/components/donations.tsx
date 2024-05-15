import Donation from "./donation";
import { Donor } from "@/actions/fetchDatas";
// import Link from "next/link";

interface DonationsProps {
  donors: Donor[];
  currentDonor: string | null;
  setCurrentDonor: (address: string) => void;
}

export default function Donations({ donors, currentDonor, setCurrentDonor }: DonationsProps) {
  const handleClick = (address: string) => {
    setCurrentDonor(address);
  };

  return (
    <div className="w-full flex flex-col landscape:p-4 lg:text-[20px] z-20">
      Recent Donations
      <div className="w-full flex landscape:flex-col portrait:lg:grid portrait:lg:grid-cols-3 gap-x-2 portrait:gap-y-2 landscape:flex-col mt-2 portrait:overflow-x-scroll">
        {donors.slice(0, 10).map((donor, index) => (
          <div key={index} className={`${index >= 6 ? "w-full block portrait:lg:hidden" : "w-full"} ${(currentDonor && currentDonor === donor.address) || (!currentDonor && index === 0) ? "text-green-500" : ""}`} onClick={() => handleClick(donor.address)}>
            <Donation key={index} address={donor.address} imageUrl={donor.imageUrl} username={donor.username} crcAmount={donor.crcAmount} />
          </div>
        ))}
      </div>
    </div>
  );
}
