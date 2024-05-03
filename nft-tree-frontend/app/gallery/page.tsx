import { fetchServerData } from "@/actions/fetchDatas";
import GalleryItem from "@/components/galleryItem";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
  return (
    <main className="flex h-screen w-full flex-col justify-between items-center">
      GALLERY
      <div className="w-full p-4 grid grid-cols-3 gap-2 lg:gap-4">
        {donors.map((donor, index) => (
          <GalleryItem key={index} address={donor.address} imageUrl={donor.imageUrl} username={donor.username} nftId={donor.nftId} />
        ))}
      </div>
      <div className="w-full">
        <div className="w-full flex border-t-2 p-4 landscape:hidden">
          <div className="min-w-24 min-h-24 border-2 p-2">
            <div className="relative w-full h-full">
              <Image src={"/QRcode.png"} alt={""} fill={true} />
            </div>
          </div>
          <div className="flex flex-col text-wrap ml-4">
            <p className="text-xs font-bold">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
            <p className="text-[8px]">Deposit 100 CRC into this address to mint an exclusive, DAPPCON 2024 CIRCLES NFT.</p>
            <p className="text-[8px] mt-2">By growing our network, you are helping to solidify the Circles Network.</p>
          </div>
        </div>
        <div className="w-full flex border-t-2 p-2">
          <Link className="flex items-center text-sm" href={"/"}>
            <ArrowLeftIcon width={18} height={18} className="mr-1" />
            BACK TO THE TREE
          </Link>
        </div>
      </div>
    </main>
  );
}
