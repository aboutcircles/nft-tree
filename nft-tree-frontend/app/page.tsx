"use client"; //TODO move down component tree

import Circles from "@/components/circles";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import useDonations from "@/hooks/use-donations";
import Image from "next/image";

function DonationBlock() {
  return (
    <div className="w-full lg:p-4">
      <p className="mb-2">Recent Donations</p>
      <Donations />
    </div>
  );
}

function NFTInfo() {
  const { totalSupply } = useDonations();
  return (
    <div className="flex flex-col items-end lg:items-start">
      <p className="text-sm lg:text-2xl">NFTS MINTED</p>
      <p className="text-lg lg:text-4xl">{totalSupply}/1000</p>
      <div className="w-28 h-28 lg:w-44 lg:h-44 border-2 mt-2">
        <Circles />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center lg:flex-row">
      <div className="h-full w-full flex flex-col p-4 relative lg:justify-between">
        <div className="hidden lg:flex flex-col">
          <NFTInfo />
        </div>
        <div className="w-full hidden lg:flex p-4">
          <div className="w-1/4">
            <div className="w-44 h-44 border-2 p-4">
              <div className="relative w-full h-full">
                <Image src={"/QRcode.png"} alt={"qrCode"} fill={true} className="w-full" />
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <div className="w-full flex flex-col text-wrap">
              <p className="text-4xl font-bold">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
              <p className="text-base">Deposit 100 CRC into this address to mint an exclusive, DAPPCON 2024 CIRCLES NFT.</p>
              <p className="text-base mt-2">By growing our network, you are helping to solidify the Circles Network.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:hidden">
          <DonationBlock />
        </div>
        <div className="h-full flex flex-col justify-end lg:hidden">
          <Tree />
        </div>
        <div className="z-10 absolute bottom-4 right-4 flex lg:hidden">
          <NFTInfo />
        </div>
      </div>
      <div className="hidden h-full w-full lg:flex">
        <div className="h-full flex flex-col justify-end">
          <Tree />
        </div>
        <DonationBlock />
      </div>
      <div className="w-full flex border-t-2 p-4 lg:hidden">
        <div className="w-2/6">
          <div className="w-24 h-24 border-2 p-2">
            <div className="relative w-full h-full">
              <Image src={"/QRcode.png"} alt={""} fill={true} />
            </div>
          </div>
        </div>
        <div className="w-4/6 flex flex-col text-wrap">
          <p className="text-xs font-bold">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
          <p className="text-[8px]">Deposit 100 CRC into this address to mint an exclusive, DAPPCON 2024 CIRCLES NFT.</p>
          <p className="text-[8px] mt-2">By growing our network, you are helping to solidify the Circles Network.</p>
        </div>
      </div>
    </main>
  );
}
