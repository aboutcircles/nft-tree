import { fetchServerData } from "@/actions/fetchDatas";
import CirclesInfo from "@/components/circlesInfo";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import Image from "next/image";

export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
  return (
    <main className="flex h-screen flex-col items-center landscape:flex-row">
      <div className="h-full w-full flex flex-col p-4 relative landscape:justify-between">
        <div className="hidden landscape:flex flex-col">
          <CirclesInfo supply={supply} />
        </div>
        <div className="w-full hidden landscape:flex p-4">
          <div className="min-w-44 min-h-44 max-h-44 border-2 p-4">
            <div className="relative w-full h-full">
              <Image src={"/QRcode.png"} alt={"qrCode"} fill={true} className="w-full" />
            </div>
          </div>
          <div className="w-full ml-4">
            <div className="w-full flex flex-col text-wrap">
              <p className="text-4xl font-bold">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
              <p className="text-base">Deposit 100 CRC into this address to mint an exclusive, DAPPCON 2024 CIRCLES NFT.</p>
              <p className="text-base mt-2">By growing our network, you are helping to solidify the Circles Network.</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col landscape:hidden">
          <Donations donors={donors} />
        </div>
        <div className="h-full flex flex-col justify-end landscape:hidden">
          <Tree nodes={consolidateTransfer} />
        </div>
        <div className="z-10 absolute bottom-4 right-4 flex landscape:hidden">
          <CirclesInfo supply={supply} />
        </div>
      </div>
      <div className="hidden h-full w-full landscape:flex">
        <div className="h-full w-full flex flex-col justify-end">
          <Tree nodes={consolidateTransfer} />
        </div>
        <Donations donors={donors} />
      </div>
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
    </main>
  );
}
