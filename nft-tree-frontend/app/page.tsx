import { fetchServerData } from "@/actions/fetchDatas";
import CirclesInfo from "@/components/circlesInfo";
import Donations from "@/components/donations";
import Tree from "@/components/tree";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
  return (
    <main className="flex h-screen flex-col items-center">
      <div className="w-full h-full flex flex-col items-center">
        <div className="h-full w-full flex flex-col relative landscape:flex-row-reverse">
          <div className="z-10 absolute right-4 bottom-40 landscape:top-4 landscape:left-4">
            <CirclesInfo supply={supply} />
          </div>
          <div className="w-fit flex flex-col p-4">
            <Donations donors={donors} />
          </div>
          <div className="h-full w-full flex flex-col justify-end p-4">
            <Tree nodes={consolidateTransfer} />
          </div>
          <div className="flex w-full items-end p-2 border-t-2 landscape:border-0">
            <div className="flex">
              <div className="border-2 p-2">
                <div className="relative w-full h-full min-w-24 min-h-24 max-w-24 max-h-24">
                  <Image src={"/QRcode.png"} alt={""} fill={true} />
                </div>
              </div>
              <div className="flex flex-col text-wrap ml-4">
                <p className="text-xs font-bold">
                  DONATE, GET AN NFT, AND GROW THE NETWORK
                </p>
                <p className="text-[8px]">
                  Deposit 100 CRC into this address to mint an exclusive,
                  DAPPCON 2024 CIRCLES NFT.
                </p>
                <p className="text-[8px] mt-2">
                  By growing our network, you are helping to solidify the
                  Circles Network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end border-t-2 p-2">
        <Link className="flex items-center text-sm" href={"/gallery"}>
          SEE THE GALLERY
          <ArrowRightIcon width={18} height={18} className="ml-1" />
        </Link>
      </div>
    </main>
  );
}
