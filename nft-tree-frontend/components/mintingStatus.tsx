import { useTreeData } from "@/hooks/useTreeData";

export default function MintingStatus() {
  const { mintingStatus } = useTreeData();
  return <>{mintingStatus ? "New donation processing..." : ""}</>;
}
