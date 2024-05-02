import axios from "axios";
import { ethers } from "ethers";
import { addresses } from "./addresses.js";

// async function getProxyCreationLogs() {
//   console.log("getProxyCreationLogs");
//   const contractAddress = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
//   // Set up the provider
//   const provider = new ethers.JsonRpcProvider("https://rpc.circlesubi.id/"); // "https://rpc.gnosischain.com");

//   // Contract ABI containing only the event we're interested in
//   const abi = [
//     "event ProxyCreation(address indexed proxy, address indexed singleton)",
//   ];

//   // Create a contract instance
//   const contract = new ethers.Contract(contractAddress, abi, provider);

//   // Define the event signature to filter logs
//   const eventFilter = contract.filters.ProxyCreation();

//   console.log("tryeee");

//   // Fetch the logs; here we just specify fromBlock and toBlock to 'latest'
//   // Adjust the range as needed to ensure you fetch the last 1000 logs
//   const logs = await provider.getLogs({
//     ...eventFilter,
//     fromBlock: 33688694, // 32703563,
//     toBlock: "latest",
//   });

//   // Assuming the logs are in descending order, slice the last 1000 events
//   // const lastThousandLogs = logs.slice(Math.max(logs.length - 1000, 0));

//   console.log(logs.length);
//   return logs;
// }

// getProxyCreationLogs()
//   .then((logs) => {
//     console.log("Fetched Logs:", logs);
//   })
//   .catch((error) => {
//     console.error("Error fetching logs:", error);
//   });

export async function getSteps(from: string) {
  const url = `https://api.circles.garden/api/transfers`;
  try {
    const response = await axios.post(url, {
      from,
      to: "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811",
      value: "1000000000000000",
    });
    // console.log(`   Found user data for ${address}`, response.data.data);
    return response.data.transferSteps;
  } catch (error) {
    console.error(`Error getting stesp: ${from}`, error);
    return {
      username: "unknown",
      avatarUrl: "",
    };
  }
}

const mockTransfers = async () => {
  const limitedAddresses = addresses.slice(-10);

  for (const address of limitedAddresses) {
    const checksumAddress = ethers.getAddress(address);
    console.log(checksumAddress);
    const steps = await getSteps(checksumAddress);
    console.log(steps);
  }
};

mockTransfers();
