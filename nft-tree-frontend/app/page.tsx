"use client"; //TODO move down component tree

import Circles from "@/components/circles";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import useDonations from "@/hooks/use-donations";

function DonationBlock() {
  return (
    <div className="w-full p-4">
      <p className="mb-2">Recent Donations</p>
      <Donations />
    </div>
  );
}

function NFTInfo() {
  const { totalSupply } = useDonations();
  return (
    <div className="flex flex-col items-end lg:items-start">
      <p>NFTS MINTED</p>
      <p>{totalSupply}/1000</p>
      <div className="w-32 h-32 border-2"><Circles /></div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center lg:flex-row">
      <div className="h-full w-full flex flex-col p-4 lg:justify-between">
        <div className="hidden lg:flex flex-col">
          <NFTInfo />
        </div>
        <div className="w-full hidden lg:flex p-4">
          <div className="w-32 h-32 border-2"></div>
          <p className="w-2/4 text-wrap ml-2">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
        </div>
        <div className="flex flex-col lg:hidden">
          <DonationBlock />
        </div>
        <div className="h-3/4 lg:hidden">
          <Tree />
        </div>
        <div className="w-full flex justify-end lg:hidden">
          <NFTInfo />
        </div>
      </div>
      <div className="hidden h-full w-full lg:flex">
        <Tree />
        <DonationBlock />
      </div>
      <div className="w-full flex border-t-2 p-4 lg:hidden">
        <div className="w-32 h-32 border-2"></div>
        <p className="w-2/4 text-wrap ml-2">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
      </div>
    </main>
  );
}
