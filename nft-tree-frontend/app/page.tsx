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
  const { donors, supply, mintingStatus } = useTreeData();
  console.log(mintingStatus);
  const [currentDonor, setCurrentDonor] = useState<string | null>(null);
  return (
    <main className="flex flex-col items-center md:h-screen">
      <div className="w-full h-full flex flex-col items-center overflow-y-scroll">
        <div className="h-full w-full flex flex-col relative landscape:flex-row-reverse">
          <div className="flex flex-col py-4 portrait:p-4 landscape:lg:flex landscape:h-full landscape:max-w-[40%]">
            {/* {mintingStatus ? (
              <div className="w-full flex flex-col justify-center items-center gap-y-4 lg:text-2xl">
                New donation processing...
              </div>
            ) : (
              ""
            )} */}
            <Donations
              donors={donors || []}
              currentDonor={currentDonor}
              setCurrentDonor={setCurrentDonor}
            />
            <div className="7xl:text-2xl h-[24px] 7xl:h-[40px] text-right portrait:text-left whitespace-normal m-4 ml-0">
              {mintingStatus ? "New donation processing..." : ""}
            </div>
          </div>
          <div className="h-[80vh] landscape:lg:h-full w-full flex flex-col justify-end">
            <Tree currentDonorChoosen={currentDonor} />
          </div>
          <div className="landscape:z-10 lg:z-10 landscape:absolute lg:absolute portrait:lg:bottom-52 portrait:lg:right-4 landscape:top-4 landscape:left-4">
            <CirclesInfo supply={supply} />
          </div>
          <div className="flex portrait:lg:absolute portrait:lg:bottom-0 w-full items-end p-2 landscape:p-4 mt-4 lg:mt-0 portrait:lg:border-t-2">
            <div className="flex w-full flex-col landscape:flex-row lg:flex-row lg:items-end landscape:items-end portrait:lg:items-start 2xl:items-start landscape:7xl:w-[720px]">
              <div className="relative aspect-square w-28 h-28 xl:w-[160px] xl:h-[160px] border-2 p-2 lg:p-2.5">
                <Image src={"/QRcode.svg"} alt={""} fill={true} />
              </div>
              <div className="flex flex-col h-full mt-4 ml-2 landscape:ml-4 landscape:mt-0 lg:mt-0">
                <p className="text-sm font-bold landscape:text-[24px] landscape:xl:text-[30px] portrait:lg:text-[32px] lg:leading-7 mb-2">
                  DONATE, MINT AND GROW THE CIRCLES NETWORK
                </p>
                <p className="text-xs lg:text-[16px]">
                  Send 100 CRC via the QR code to mint your unique DAPPCON24
                  NFT.
                </p>
                <p className="text-xs lg:text-[16px] mt-2">
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
