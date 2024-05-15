import { Donor } from "@/actions/fetchDatas";
import { truncateAddress } from "@/utils/truncateAddress";
import Image from "next/image";

export default function Donation({ address, imageUrl, username, crcAmount }: Donor) {
  return (
    <div className="w-full flex justify-between items-center border lg:border-b-0 lg:last:border-b border-slate-300 p-2 lg:p-4 hover:cursor-pointer min-w-[280px] landscape:lg:min-w-[300px]">
      {imageUrl ? <Image src={imageUrl} alt={""} width={25} height={25} objectFit="cover" className="border-white border w-6 h-6 lg:w-9 lg:h-9" /> : <div className="border-white text-white flex items-center justify-center text-lg border w-6 h-6 lg:w-9 lg:h-9 lg:min-w-9">?</div>}
      <div className="w-full ml-4">
        <p className="text-[14px] lg:text-[16px]">{username ? username : truncateAddress(address)}</p>
      </div>
      <p className="text-nowrap text-[14px] lg:text-[16px] ml-4">{crcAmount} CRC</p>
    </div>
  );
}
