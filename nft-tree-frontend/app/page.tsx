"use client";
import CirclesInfo from "@/components/CirclesInfo";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import { useTreeData } from "@/hooks/useTreeData";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { donors, supply } = useTreeData();
  const [currentDonor, setCurrentDonor] = useState<string | null>(null);
  return (
    <main className="flex h-screen flex-col items-center">
      <div className="w-full h-full flex flex-col items-center">
        <div className="h-full w-full flex flex-col relative landscape:flex-row-reverse">
          <div className="z-10 absolute right-4 bottom-40 portrait:lg:bottom-64 landscape:top-4 landscape:left-4">
            <CirclesInfo supply={supply} />
          </div>
          <div className="w-fit flex flex-col p-4 landscape:hidden landscape:lg:flex">
            <Donations
              donors={donors || []}
              currentDonor={currentDonor}
              setCurrentDonor={setCurrentDonor}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-end p-4">
            <Tree currentDonor={currentDonor} />
          </div>
          <div className="flex w-full items-end p-2 landscape:p-4 border-t-2 landscape:border-0">
            <div className="flex">
              <div className="border-2 p-2">
                <div className="relative w-24 h-24 portrait:lg:w-48 portrait:lg:h-48">
                  <Image src={"/QRcode.png"} alt={""} fill={true} />
                </div>
              </div>
              <div className="flex flex-col text-wrap ml-4">
                <p className="text-xs font-bold portrait:lg:text-4xl">
                  DONATE, GET AN NFT, AND GROW THE NETWORK
                </p>
                <p className="text-[8px] portrait:lg:text-2xl">
                  Deposit 100 CRC into this address to mint an exclusive,
                  DAPPCON 2024 CIRCLES NFT.
                </p>
                <p className="text-[8px] portrait:lg:text-2xl mt-2">
                  By growing our network, you are helping to solidify the
                  Circles Network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black w-full flex justify-end border-t-2 p-2">
        <Link className="flex items-center text-sm portrait:lg:text-2xl" href={"/gallery"}>
          SEE THE GALLERY
          <ArrowRightIcon width={18} height={18} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}
