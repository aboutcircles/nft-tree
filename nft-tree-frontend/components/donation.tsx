import { truncateAddress } from "@/utils/truncateAddress";
import Link from "next/link";
import { Address } from "viem";

type DonationProps = {
  address: Address;
};

export default function Donation({ address }: DonationProps) {
  return (
    <Link className="w-full flex justify-between items-center border-t border-l border-r border-b lg:border-b-0 lg:last:border-b border-slate-300 p-1 lg:p-2 hover:cursor-pointer" href={"https://circles.garden/profile/" + address} target="_blank">
      <div className="flex flex-col">
        <p>From</p>
        <p className="text-[10px]">{truncateAddress(address)}</p>
      </div>
      50 CRC
    </Link>
  );
}
