import { Donor } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";
import Link from "next/link";

export default function Donation({ address, imageUrl, username }: Donor) {
  return (
    <Link className="w-full flex justify-between items-center border-t border-l border-r border-b lg:border-b-0 lg:last:border-b border-slate-300 p-1 lg:p-2 hover:cursor-pointer" href={"https://circles.garden/profile/" + address} target="_blank">
      {imageUrl ? <Image src={imageUrl} alt={""} /> : ""}
      <div className="flex flex-col">
        <p>From</p>
        <p className="text-[10px]">{truncateAddress(address)}</p>
        {/* <p className="text-[10px]">{username}</p> */}
      </div>
      50 CRC
    </Link>
  );
}
