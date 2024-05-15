"use client";
import CirclesInfo from "@/components/CirclesInfo";
import Donations from "@/components/donations";
import Loader from "@/components/loader";
import Tree from "@/components/tree";
import { useTreeData } from "@/hooks/useTreeData";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { donors, supply, mintingStatus } = useTreeData();
  console.log(mintingStatus);
  const [currentDonor, setCurrentDonor] = useState<string | null>(null);
  return (
    <main className="flex h-screen flex-col items-center">
      <div className="w-full h-full flex flex-col items-center">
        <div className="h-full w-full flex flex-col relative landscape:flex-row-reverse">
          <div className="z-10 absolute right-4 bottom-40 portrait:lg:bottom-64 landscape:top-4 landscape:left-4">
            <CirclesInfo supply={supply} />
          </div>
          <div className="w-full flex flex-col p-4 landscape:hidden landscape:lg:flex">
            {mintingStatus ? (
              <div className="w-full flex flex-col justify-center items-center gap-y-4 lg:text-2xl">
                New donation processing...
                <Loader />
              </div>
            ) : (
              ""
            )}
            <Donations
              donors={donors || []}
              currentDonor={currentDonor}
              setCurrentDonor={setCurrentDonor}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-end">
            <Tree currentDonorChoosen={currentDonor} />
          </div>
          <div className="flex w-full items-end p-2 landscape:p-4 border-t-2 landscape:border-0">
            <div className="flex landscape:lg:w-[720px]">
              <div className="border-2 p-2">
                <div className="relative w-24 h-24 portrait:lg:w-48 portrait:lg:h-48">
                  <Image src={"/QRcode.svg"} alt={""} fill={true} />
                </div>
              </div>
              <div className="flex flex-col text-wrap ml-4">
                <p className="text-xs font-bold portrait:lg:text-4xl">
                  DONATE, MINT AND GROW THE CIRCLES NETWORK
                </p>
                <p className="text-[8px] portrait:lg:text-2xl">
                  Send 100 CRC via the QR code to mint your unique DAPPCON24 NFT.
                </p>
                <p className="text-[8px] portrait:lg:text-2xl mt-2">
                  Visit dappcon.aboutcircles.com to view the tree and gallery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black w-full flex justify-end border-t-2 p-2 portrait:lg:hidden">
        <Link
          className="flex items-center text-sm lg:text-2xl"
          href={"/gallery"}
        >
          SEE THE GALLERY
          <ArrowRightIcon width={18} height={18} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}
