"use client";
import { TreeDataContext } from "@/providers/TreeDataProvider";
import { TreeDataContextType } from "@/types/types";
import { useContext } from "react";

export const useTreeData = (): TreeDataContextType => {
  const context = useContext(TreeDataContext);
  if (!context) {
    throw new Error("useTreeData must be used within a ValueProvider");
  }
  const {
    donors,
    supply,
    nfts,
    transfers,
    branches,
    mintingStatus,
    mintingBranches,
  } = context;
  return {
    donors,
    supply,
    nfts,
    transfers,
    branches,
    mintingStatus,
    mintingBranches,
  };
};
