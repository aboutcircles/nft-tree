<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d477157 (added filter functionality for mobile view)
"use client"
import { useState, useEffect } from "react";
import { fetchServerData } from "@/actions/fetchDatas";
import GalleryItem from "@/components/galleryItem";
=======
import { fetchServerData } from "@/actions/fetchDatas";
>>>>>>> 3d415f1 (feat: add gallery button on main page)
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d477157 (added filter functionality for mobile view)
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { consolidateTransfer, donors, supply } = await fetchServerData();
      setDonors(donors);
      setFilteredDonors(donors); // Initially, display all donors
    };
    fetchData();

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
    // Filter donors when searchQuery changes
    const filtered = donors.filter((donor) => {
      if (!isNaN(searchQuery)) {
        // If searchQuery is a number, filter based on nftId
        return donor.nftId === parseInt(searchQuery);
      } else {
        // If searchQuery is not a number, filter based on address or username
        return (
          donor.address.includes(searchQuery) ||
          donor.username.includes(searchQuery)
        );
      }
    });
    setFilteredDonors(filtered);
  }, [searchQuery, donors]);

<<<<<<< HEAD
  return (
    <main className="flex flex-col h-screen w-full bg-black text-white">
  <div className="p-2 flex flex-col items-center justify-center">DAPPCON'2024 MINTER GALLERY</div>
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
     <div className="w-full p-4 landscape:px-16 grid grid-cols-3 landscape:grid-cols-5 gap-4">
        {searchQuery === "" ? (
          // If searchQuery is empty, render all donors
          donors.map((donor, index) => (
            <GalleryItem
              key={index}
              address={donor.address}
              imageUrl={donor.imageUrl}
              username={donor.username}
              nftId={donor.nftId}
            />
          ))
        ) : (
          // If searchQuery is not empty, render filtered donors
          filteredDonors.map((donor, index) => (
            <GalleryItem
              key={index}
              address={donor.address}
              imageUrl={donor.imageUrl}
              username={donor.username}
              nftId={donor.nftId}
            />
          ))
        )}
      </div>
      <div className="p-4 border-t-2 border-white">
        <div className="flex items-center">
=======
export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
=======
>>>>>>> d477157 (added filter functionality for mobile view)
  return (
    <main className="flex flex-col h-screen w-full bg-black text-white">
  <div className="p-2 flex flex-col items-center justify-center">DAPPCON'2024 MINTER GALLERY</div>
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
<<<<<<< HEAD
      <div className="w-full">
        <div className="w-full flex border-t-2 p-4 landscape:hidden">
>>>>>>> 3d415f1 (feat: add gallery button on main page)
=======
    </div>
      )}
     <div className="w-full p-4 landscape:px-16 grid grid-cols-3 landscape:grid-cols-5 gap-4">
        {searchQuery === "" ? (
          // If searchQuery is empty, render all donors
          donors.map((donor, index) => (
            <GalleryItem
              key={index}
              address={donor.address}
              imageUrl={donor.imageUrl}
              username={donor.username}
              nftId={donor.nftId}
            />
          ))
        ) : (
          // If searchQuery is not empty, render filtered donors
          filteredDonors.map((donor, index) => (
            <GalleryItem
              key={index}
              address={donor.address}
              imageUrl={donor.imageUrl}
              username={donor.username}
              nftId={donor.nftId}
            />
          ))
        )}
      </div>
      <div className="p-4 border-t-2 border-white">
        <div className="flex items-center">
>>>>>>> d477157 (added filter functionality for mobile view)
          <div className="min-w-24 min-h-24 border-2 p-2">
            <div className="relative w-full h-full">
              <Image src={"/QRcode.png"} alt={""} fill={true} />
            </div>
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d477157 (added filter functionality for mobile view)
          <div className="ml-4">
            <p className="text-xs font-bold">
              DONATE, GET AN NFT, AND GROW THE NETWORK
            </p>
            <p className="text-xs">
              Deposit 100 CRC into this address to mint an exclusive, DAPPCON
              2024 CIRCLES NFT.
            </p>
            <p className="text-xs mt-2">
              By growing our network, you are helping to solidify the Circles
              Network.
            </p>
<<<<<<< HEAD
          </div>
        </div>
        <div className="mt-4">
=======
          <div className="flex flex-col text-wrap ml-4">
            <p className="text-xs font-bold">DONATE, GET AN NFT, AND GROW THE NETWORK</p>
            <p className="text-[8px]">Deposit 100 CRC into this address to mint an exclusive, DAPPCON 2024 CIRCLES NFT.</p>
            <p className="text-[8px] mt-2">By growing our network, you are helping to solidify the Circles Network.</p>
          </div>
        </div>
        <div className="w-full flex border-t-2 p-2">
>>>>>>> 3d415f1 (feat: add gallery button on main page)
=======
          </div>
        </div>
        <div className="mt-4">
>>>>>>> d477157 (added filter functionality for mobile view)
          <Link className="flex items-center text-sm" href={"/"}>
            <ArrowLeftIcon width={18} height={18} className="mr-1" />
            BACK TO THE TREE
          </Link>
        </div>
      </div>
    </main>
  );
}
