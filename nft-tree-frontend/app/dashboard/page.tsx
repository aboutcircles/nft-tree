import { fetchServerData } from "@/actions/fetchDatas";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { consolidateTransfer, donors, supply } = await fetchServerData();
  return (
    <main className="flex h-screen flex-col items-center p-4">
      <div className="w-full">
        <Link href={"/"}>
          <ArrowLeftIcon width={20} height={20} />
        </Link>
      </div>
    </main>
  );
}
