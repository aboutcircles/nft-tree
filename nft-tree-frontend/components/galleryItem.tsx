import { Donor, NFT } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";
import Link from "next/link";

export default function GalleryItem({ address, imageUrl, username, nftId, timestamp }: NFT) {
  return (
    <Link className="min-w-42 flex flex-col justify-between items-center border border-slate-300 text-xs hover:cursor-pointer" href={"https://circles.garden/profile/" + address} target="_blank">
      <div className="w-full border-b p-1">
        DAPPCON 2024
        <div className="w-full flex justify-center my-2">
          <Image src={"/circlesIcon.svg"} alt={""} width={80} height={80} />
        </div>
        <div className="w-full flex justify-between">
          <p className="">Circles</p>
          <p>{nftId}/1000</p>
        </div>
      </div>
      <div className="w-full flex flex-col p-2">
        <div className="w-full flex justify-between">
          <div className="flex flex-col">
            <p className="text-[10px] lg:text-[12px] text-white/50">MINTED BY</p>
            <p className="text-[8px] lg:text-[10px]">{username ? username : truncateAddress(address)}</p>
          </div>
          {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} className="border-white border w-6 h-6 lg:w-8 lg:h-8" /> : <div className="border-white flex items-center justify-center text-lg border w-6 h-6 lg:w-8 lg:h-8">?</div>}
        </div>
        <p className="text-[10px] lg:text-[12px] text-white/50">MINTED ON</p>
        <p className="text-[8px] lg:text-[10px]">{new Date(Number(timestamp) * 1000).toDateString()}</p>
      </div>
    </Link>
  );
}
