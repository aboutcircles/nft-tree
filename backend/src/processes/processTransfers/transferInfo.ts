import axios from "axios";
// import { ethers } from "ethers";

export async function getTransferSteps(
  transactionHash: string,
  amount: string
) {
  // console.log("Getting transfer steps for transaction", transactionHash);

  try {
    const response = await axios.post(
      "https://circles-rpc.circlesubi.id/",
      {
        jsonrpc: "2.0",
        method: "circles_queryCrcTransfers",
        params: [{ transactionHash }],
        id: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const steps = response.data.result
      .filter((step: any) => step.amount === amount)
      .map((step: any) => {
        return {
          from: step.fromAddress,
          to: step.toAddress,
        };
      });
    // console.log(`   Found steps for ${transactionHash}`, steps);
    return steps;
  } catch (error) {
    console.error(
      `Error making POST get transfer steps for ${transactionHash}`,
      error
    );
    throw error;
  }
}

export async function getUserData(address: string) {
  const url = `https://api.circles.garden/api/users?address[]=${address}`;
  try {
    const response = await axios.get(url);
    // console.log(`   Found user data for ${address}`, response.data.data);
    return response.data.data[0];
  } catch (error) {
    console.error(`Error making GET user data request for: ${address}`, error);
    return {
      username: "unknown",
      avatarUrl: "",
    };
  }
}
