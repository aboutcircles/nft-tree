import { Donor, NFT } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";
import Link from "next/link";

export default function GalleryItem({ address, imageUrl, username, nftId, timestamp }: NFT) {
  return (
    <Link className="min-w-42 max-w-[1570px] flex flex-col justify-between items-center border border-slate-300 text-xs hover:cursor-pointer portrait:lg:text-4xl" href={"https://circles.garden/profile/" + address} target="_blank">
      <div className="aspect-square w-full flex flex-col justify-between border-b p-1">
        DAPPCON 2024
        <div className="w-full flex justify-center my-2">
          <Image src={"/circlesIcon.svg"} alt={""} width={80} height={80} className="w-20 h-20 portrait:lg:w-44 portrait:lg:h-44"/>
        </div>
        <div className="w-full flex justify-between">
          <p className="">CIRCLES</p>
          <p>{nftId}/1000</p>
        </div>
      </div>
      <div className="w-full flex flex-col p-2 lg:p-4">
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-y-1 truncate">
            <p className="text-[12px] lg:text-[14px] portrait:lg:text-3xl text-white/50">MINTED BY</p>
            <p className="text-[14px] lg:text-[16px] portrait:lg:text-2xl text-ellipsis overflow-hidden">{username ? username : truncateAddress(address)}</p>
          </div>
          {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} className="border-white border w-6 h-6 lg:w-8 lg:h-8 portrait:lg:w-12 portrait:lg:h-12" /> : <div className="border-white flex items-center justify-center text-lg portrait:lg:text-xl border w-6 h-6 lg:w-8 lg:h-8 portrait:lg:w-12 portrait:lg:h-12">?</div>}
        </div>
        <p className="text-[12px] lg:text-[14px] portrait:lg:text-3xl text-white/50 mt-2">MINTED ON</p>
        <p className="text-[14px] lg:text-[16px] portrait:lg:text-2xl mt-1">{new Date(Number(timestamp) * 1000).toDateString()}</p>
      </div>
    </Link>
  );
}
