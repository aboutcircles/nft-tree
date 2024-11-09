import axios from 'axios';
// import { fetchMockData } from "./mockData.js";

const fetchRealData = async () => {
  console.log('fetching for', process.env.DONATION_ADDRESS);
  const response = await axios.post(
    'https://rpc.aboutcircles.com/',
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'circles_query',
      params: [
        {
          Namespace: 'CrcV2',
          Table: 'StreamCompleted',
          Limit: 10000,
          Filter: [
            {
              Type: 'Conjunction',
              ConjunctionType: 'And',
              Predicates: [
                {
                  Type: 'FilterPredicate',
                  FilterType: 'Equals',
                  Column: 'to',
                  Value: process.env.DONATION_ADDRESS?.toLowerCase(),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
};

export async function fetchTransfers(): Promise<{
  data: { result: { rows: any[] } };
}> {
  const response = await fetchRealData();
  // const response = await fetchMockData();

  return response;
}
