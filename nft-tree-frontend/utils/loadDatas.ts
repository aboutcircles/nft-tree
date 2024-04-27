import { Node } from "@/components/tree";
import { Address } from "viem";

type Transfer = {
  from: Address;
  to: Address;
  tokenOwner: string;
  value: string;
};

export async function loadAllData(fileNames: string[]) {
  const allTransfers = [];

  for (let fileName of fileNames) {
    const { transfers = [] } = await import(`./data/${fileName}`);
    allTransfers.push(...transfers);
  }

  return allTransfers;
}

export function consolidateTransfers(transfers: Transfer[]): Node[] {
  const nodesMap: Map<Address, Node> = new Map();

  transfers.forEach(({ from, to }) => {
    if (!nodesMap.has(from)) {
      nodesMap.set(from, { id: from, children: new Set(), level: -1, x: 0, y: 0 });
    }
    if (!nodesMap.has(to)) {
      nodesMap.set(to, { id: to, children: new Set(), level: -1, x: 0, y: 0 });
    }

    nodesMap.get(to)?.children.add(from);
  });

  const rootAddress = "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811";
  const root = nodesMap.get(rootAddress);
  if (root) {
    root.level = 0;
    computeLevels(nodesMap, root);
  }

  return Array.from(nodesMap.values());
}

function computeLevels(nodesMap: Map<Address, Node>, root: Node) {
  const queue: [Address, number][] = [[root.id, 0]];

  while (queue.length > 0) {
    const [currentId, currentLevel] = queue.shift()!;
    const currentNode = nodesMap.get(currentId);
    if (currentNode) {
      currentNode.children.forEach((childId) => {
        const childNode = nodesMap.get(childId);
        if (childNode && (childNode.level === -1 || currentLevel + 1 < childNode.level)) {
          childNode.level = currentLevel + 1;
          queue.push([childId, currentLevel + 1]);
        }
      });
    }
  }
}
