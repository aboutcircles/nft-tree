"use client";

import { CirclesDataContext } from "@/providers/CirclesDataProvider";
import { CirclesDataContextType } from "@/types/types";
import { useContext } from "react";

export const useCirclesData = (): CirclesDataContextType => {
  const context = useContext(CirclesDataContext);
  if (!context) {
    throw new Error("useTreeData must be used within a ValueProvider");
  }
  const { circlesAmount } = context;
  return {
    circlesAmount,
  };
};
