import { Donor } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";
import Link from "next/link";

export default function Donation({ address, imageUrl, username, crcAmount }: Donor) {
  return (
    <Link className="w-full flex justify-between items-center border-t border-l border-r border-b lg:border-b-0 lg:last:border-b border-slate-300 p-2 lg:p-2 hover:cursor-pointer" href={"https://circles.garden/profile/" + address} target="_blank">
      {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} objectFit="cover" className="border-white border w-6 h-6 lg:w-8 lg:h-8" /> : <div className="border-white flex items-center justify-center text-lg border w-6 h-6 lg:w-8 lg:h-8">?</div>}
      <p className="text-[10px] ml-2">{username ? username : truncateAddress(address)}</p>
      <p className="text-nowrap text-[10px] ml-4">{crcAmount} CRC</p>
    </Link>
  );
}
