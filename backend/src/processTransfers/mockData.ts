import mockTransfers from "../testData/transfers.json" assert { type: "json" };
interface TransferStep {
  from: string;
  to: string;
}
interface StepsIndex {
  [key: string]: TransferStep[];
}

import steps from "../testData/steps.json" assert { type: "json" };

export async function getMockTransferSteps(
  address: string
): Promise<TransferStep[]> {
  return (steps as StepsIndex)[address];
}

let currentRangeIndex: number = 0;

export const fetchMockData = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    currentRangeIndex = currentRangeIndex + 5;
    const slicedData = mockTransfers.slice(0, currentRangeIndex);

    resolve({ data: { result: slicedData } });
  });
};

export const fetchHardCodedData = () => {
  const response = {
    data: {
      result: [
        {
          timestamp: "1713793050",
          blockNumber: "33573243",
          transactionHash:
            "0x584a5442301cfd5a4db940d709c75e9971044c6f20af80272d23ed10a69f9b2b",
          fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
          toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
          amount: "4232027253759994",
          cursor: "33573243-3-3",
        },
        {
          timestamp: "1713887530",
          blockNumber: "33591446",
          transactionHash:
            "0x50323d2d3db5f11219c13b36c5dff94875528a245ca9cd9c9cfaee02f0bb77f0",
          fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
          toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
          amount: "4232883036903554",
          cursor: "33591446-0-3",
        },
        {
          timestamp: "1713890950",
          blockNumber: "33592106",
          transactionHash:
            "0x92571ac2318615d139853daaf606ac54d3687c072a9381c3e736cbe86f2e958c",
          fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
          toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
          amount: "4232913965497125",
          cursor: "33592106-9-3",
        },
        {
          timestamp: "1713891210",
          blockNumber: "33592158",
          transactionHash:
            "0xeb372b30751cde47b4ce664eb28d1adb3089c212d2f8bc6e7bcf0f0c0ac8391d",
          fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
          toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
          amount: "4232916341764401",
          cursor: "33592158-6-3",
        },
        {
          timestamp: "1713973340",
          blockNumber: "33608029",
          transactionHash:
            "0x2107052d3015732149c0cc9cd2aca386e685b860d936c80a4c8e0f521ebbabb3",
          fromAddress: "0xf9e09abf3918721941bcdd98434cbe2f2ff13685",
          toAddress: "0xf76fde93ba87ba9037c64d3c51082d2db0ac658e",
          amount: "423366028819257100",
          cursor: "33608029-23-3",
        },
      ],
    },
  };
  return response;
};
