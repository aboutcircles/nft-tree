import CirclesIcon from "./circlesIcon";

interface CirclesInfoProps {
  supply: number | undefined;
  circlesAmount: number | undefined;
}

export default function CirclesInfo({ supply, circlesAmount }: CirclesInfoProps) {
  return (
    <div className="flex justify-start md:justify-between gap-x-4 items-center portrait:w-screen lanscape:w-full md:w-full portrait:md:items-end border-2 landscape:border-0 md:border-0 landscape:flex-col md:flex-col portrait:md:flex-col-reverse landscape:items-start p-2 md:p-0">
      <div className="w-12 h-12 landscape:w-28 landscape:h-28 landscape:lg:w-[180px] landscape:lg:h-[180px] portrait:lg:w-[240px] portrait:lg:h-[240px] landscape:md:w-[120px] landscape:md:h-[120px] portrait:md:w-[180px] portrait:md:h-[180px] border-2 lg:mt-2">
        <CirclesIcon />
      </div>
      <div className="flex flex-col items-end landscape:items-start">
        <p className="text-sm md:text-lg lg:text-2xl">NFTS MINTED</p> <p className="text-md md:text-2xl lg:text-4xl">{supply || 0}/1000</p>
      </div>
      <div className="flex flex-col items-end landscape:items-start">
        <p className="text-sm md:text-lg lg:text-2xl">TOTAL DONATED</p> <p className="text-md md:text-2xl lg:text-4xl md:portrait:mb-2">{circlesAmount || 0} CRC</p>
      </div>
    </div>
  );
}
