import axios from "axios";
// import { fetchMockData } from "./mockData.js";

const fetchRealData = async () => {
  const response = await axios.post(
    "https://circles-rpc.aboutcircles.com/",
    {
      jsonrpc: "2.0",
      method: "circles_queryHubTransfers",
      params: [
        {
          Limit: 1000,
          ToAddress: process.env.DONATION_ADDRESS,
        },
      ],
      id: 1,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export async function fetchTransfers(): Promise<{ data: { result: any[] } }> {
  const response = await fetchRealData();
  // const response = await fetchMockData();

  return response;
}
