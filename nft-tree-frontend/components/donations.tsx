import { Address } from "viem";
import Donation from "./donation";

interface DonationsProps {
  donors: Address[];
}

export default function Donations({ donors }: DonationsProps) {
  // const { donors } = useDonations();

  return (
    <div className="w-full max-w-52 lg:p-4">
      <p className="mb-2">Recent Donations</p>
      <div className="w-full flex gap-x-1 lg:flex-col text-xs">
        {donors.slice(0, 10).map((donor, index) => (
          <div key={index} className={`${index >= 3 ? 'hidden sm:block' : ''}`}>
            <Donation key={index} address={donor} />
          </div>
        ))}
      </div>
    </div>
  );
}
