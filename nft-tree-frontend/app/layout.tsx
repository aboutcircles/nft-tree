import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { TreeDataProvider } from "@/providers/TreeDataProvider";

const space_mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Circles Tree NFT",
  description: "Circles Tree NFT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={space_mono.className}>
        <TreeDataProvider>
          <div className="bg-black w-full h-full text-white">{children} </div>
        </TreeDataProvider>
      </body>
    </html>
  );
}
