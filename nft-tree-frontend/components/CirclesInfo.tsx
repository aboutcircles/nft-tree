import CirclesIcon from "./circlesIcon";

interface CirclesInfoProps {
  supply: number | undefined;
}

export default function CirclesInfo({ supply }: CirclesInfoProps) {
  return (
    <div className="flex flex justify-between items-center portrait:w-screen lanscape:w-full lg:w-full portrait:lg:items-end border-2 landscape:border-0 lg:border-0 landscape:flex-col lg:flex-col portrait:lg:flex-col-reverse landscape:items-start p-2 lg:p-0">
      <div className="w-12 h-12 landscape:w-28 landscape:h-28 landscape:lg:w-[180px] landscape:lg:h-[180px] portrait:lg:w-[240px] portrait:lg:h-[240px] border-2 lg:mt-2">
        <CirclesIcon />
      </div>
      <p className="text-sm lg:text-2xl">NFTS MINTED</p> <p className="text-lg lg:text-4xl">{supply || 0}/1000</p>
    </div>
  );
}
