"use client";
import { useState, useEffect } from "react";
import { NFT } from "@/actions/fetchDatas";
import GalleryItem from "@/components/galleryItem";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useTreeData } from "@/hooks/useTreeData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { nfts } = useTreeData();

  useEffect(() => {
    // Check screen size on mount
    setIsSmallScreen(window.innerWidth <= 768);

    // Update screen size on resize
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Filter nfts when searchQuery changes
    const filtered = nfts?.filter((nft) => {
      if (!isNaN(Number(searchQuery))) {
        // If searchQuery is a number, filter based on nftId
        console.log(searchQuery);
        return nft.nftId === parseInt(searchQuery);
      } else {
        // If searchQuery is not a number, filter based on address or username
        return (
          nft.address.includes(searchQuery) ||
          nft.username.includes(searchQuery)
        );
      }
    });
    setFilteredNfts(filtered || []);
  }, [searchQuery, nfts]);

  return (
    <main className="flex flex-col h-screen w-full bg-black text-white">
      <div className="p-2 flex flex-col items-center justify-center">
        DAPPCON 2024 MINTER GALLERY
      </div>
      {isSmallScreen && (
        <div className="p-4 flex flex-col items-center justify-center border-b-2 border-white">
          <div className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by NFT ID, address, or username"
              className="border rounded px-2 py-1 bg-black text-white mr-2"
            />
            <button
              onClick={() => setSearchQuery("")}
              className="bg-transparent text-white px-2 py-1 rounded border border-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      <div className="w-full overflow-y-scroll p-4 landscape:px-16 grid grid-cols-3 landscape:grid-cols-5 gap-4">
        {searchQuery === ""
          ? // If searchQuery is empty, render all nfts
            nfts?.map((nft, index) => (
              <GalleryItem
                key={index}
                address={nft.address}
                imageUrl={nft.imageUrl}
                username={nft.username}
                nftId={nft.nftId}
                timestamp={nft.timestamp}
              />
            ))
          : // If searchQuery is not empty, render filtered nfts
            filteredNfts.map((nft, index) => (
              <GalleryItem
                key={index}
                address={nft.address}
                imageUrl={nft.imageUrl}
                username={nft.username}
                nftId={nft.nftId}
                timestamp={nft.timestamp}
              />
            ))}
      </div>
      <div className="flex w-full items-end p-2 border-t-2 landscape:hidden">
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
              Deposit 100 CRC into this address to mint an exclusive, DAPPCON
              2024 CIRCLES NFT.
            </p>
            <p className="text-[8px] mt-2">
              By growing our network, you are helping to solidify the Circles
              Network.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex border-t-2 p-2">
        <Link className="flex items-center text-sm" href={"/"}>
          <ArrowLeftIcon width={18} height={18} className="mr-1" />
          BACK TO THE TREE
        </Link>
      </div>
    </main>
  );
}
