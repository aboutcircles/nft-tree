import { fetchServerData } from "@/actions/fetchDatas";
import CirclesInfo from "@/components/CirclesInfo";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import Image from "next/image";

export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
  return (
    <main className="flex h-screen flex-col items-center lg:flex-row">
      <div className="h-full w-full flex flex-col p-4 relative lg:justify-between">
        <div className="hidden lg:flex flex-col">
          <CirclesInfo supply={supply} />
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
          <Donations donors={donors} />
        </div>
        <div className="h-full flex flex-col justify-end lg:hidden">
          <Tree nodes={consolidateTransfer} />
        </div>
        <div className="z-10 absolute bottom-4 right-4 flex lg:hidden">
          <CirclesInfo supply={supply} />
        </div>
      </div>
      <div className="hidden h-full w-full lg:flex">
        <div className="h-full flex flex-col justify-end">
          <Tree nodes={consolidateTransfer} />
        </div>
        <Donations donors={donors} />
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
