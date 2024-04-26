import axios from "axios";

export async function getTransferSteps(
  transactionHash: string,
  amount: string
) {
  const url = "https://goldfish-app-4unju.ondigitalocean.app/api/pathfinder";
  const data = {
    method: "circles_queryCrcTransfers",
    params: { transactionHash },
  };

  try {
    const response = await axios.post(url, data);
    console.log("Response:", response.data);
    return response.data
      .filter((step: any) => step.amount === amount)
      .map((step: any) => {
        return {
          from: step.fromAddress,
          to: step.toAddress,
        };
      });
  } catch (error) {
    console.error("Error making POST compute transfers request:", error);
    throw error;
  }
}

export async function getUserData(address: string) {
  const url = `https://api.circles.garden/api/users?address[]=${address}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error making GET user data request:", error);
    throw error;
  }
}
