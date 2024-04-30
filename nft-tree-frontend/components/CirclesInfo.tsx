import Circles from "./circles";

interface CirclesInfoProps {
  supply: number;
}

export default function CirclesInfo({ supply }: CirclesInfoProps) {
  return (
    <div className="flex flex-col items-end lg:items-start">
      <p className="text-sm lg:text-2xl">NFTS MINTED</p>
      <p className="text-lg lg:text-4xl">{supply}/1000</p>
      <div className="w-28 h-28 lg:w-44 lg:h-44 border-2 mt-2">
        <Circles />
      </div>
    </div>
  );
}
