import CirclesIcon from "./circlesIcon";

interface CirclesInfoProps {
  supply: number | undefined;
}

export default function CirclesInfo({ supply }: CirclesInfoProps) {
  return (
    <div className="flex flex-col items-end landscape:items-start">
      <p className="text-sm lg:text-2xl">NFTS MINTED</p>
      <p className="text-lg lg:text-4xl">{supply || 0}/1000</p>
      <div className="w-24 h-24 landscape:w-28 landscape:h-28 lg:w-48 lg:h-48 border-2 mt-2">
        <CirclesIcon />
      </div>
    </div>
  );
}
