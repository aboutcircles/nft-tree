"use server";

import { consolidateTransfers, loadAllData } from "@/utils/loadDatas";
import { readdir } from "fs/promises";
import path from "path";

export async function fetchFilesData() {
  try {
    const dataDirectory = path.join(process.cwd(), "/utils/data");
    const filenames = await readdir(dataDirectory);
    const allTransfers = await loadAllData(filenames);
    return consolidateTransfers(allTransfers);
  } catch (error) {
    console.error("Failed to read file:", error);
    throw new Error("Failed to load data");
  }
}
