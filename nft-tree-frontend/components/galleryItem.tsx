import { Donor } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";
import Link from "next/link";
import CirclesIcon from "./circlesIcon";

export default function GalleryItem({ address, imageUrl, username, nftId }: Donor) {
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
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          <div className="flex flex-col">
            <p className="text-[12px] text-white/50">MINTED BY</p>
            <p className="text-[10px]">{truncateAddress(address)}</p>
          </div>
          {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} className="border-white border" /> : <Image src={"/profileDefault.jpg"} alt={"profileDefault"} width={25} height={25} className="border-white border" />}
        </div>
        <p className="text-[12px] text-white/50">MINTED ON</p>
      </div>
      {/* {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} /> : <Image src={"/profileDefault.jpg"} alt={"profileDefault"} width={25} height={25} className="border-white border" />}
      <p className="text-[10px] ml-2">{truncateAddress(address)}</p>
      <p className="text-nowrap text-[10px] ml-4">100 CRC</p> */}
    </Link>
  );
}
