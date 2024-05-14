import axios from "axios";

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

const j = {
  jsonrpc: "2.0",
  result: [
    {
      timestamp: "1714480010",
      blockNumber: "33706057",
      transactionHash:
        "0xc9c7b823d9e949fee3ca8e92ab214453d28b0257b1cd68fac67421679aacbdef",
      fromAddress: "0xf7bd3d83df90b4682725adf668791d4d1499207f",
      toAddress: "0x0cc035ddf238cc4ba7b81d5096880c264f0a42a1",
      amount: "145119325642261453546",
      tokenAddress: "0x6b35c6da733836be97ced8627c3747824450926b",
      cursor: "33706057-4-1",
    },
    {
      timestamp: "1714480010",
      blockNumber: "33706057",
      transactionHash:
        "0xc9c7b823d9e949fee3ca8e92ab214453d28b0257b1cd68fac67421679aacbdef",
      fromAddress: "0xf7bd3d83df90b4682725adf668791d4d1499207f",
      toAddress: "0x0cc035ddf238cc4ba7b81d5096880c264f0a42a1",
      amount: "1332758298728659146454",
      tokenAddress: "0xbd31295bd15f768db838fed2288d0fc5993ab63e",
      cursor: "33706057-4-2",
    },
    {
      timestamp: "1714480010",
      blockNumber: "33706057",
      transactionHash:
        "0xc9c7b823d9e949fee3ca8e92ab214453d28b0257b1cd68fac67421679aacbdef",
      fromAddress: "0xf7bd3d83df90b4682725adf668791d4d1499207f",
      toAddress: "0x9944ce8e27ce1f16c4003f108b1c09e5ae011ba0",
      amount: "298379",
      tokenAddress: "0x915e408ee38d08fd3cb0a9fe7c3e2408d51a56df",
      cursor: "33706057-4-4",
    },
  ],
  id: 1,
};
