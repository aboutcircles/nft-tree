import { Address } from "viem";

type DonationProps = {
  address: Address;
};

export default function Donation({ address }: DonationProps) {
  return <div className="w-full">{address}</div>;
}
