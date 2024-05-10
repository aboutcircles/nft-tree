import data from "./treeData.json" assert { type: "json" };

interface Step {
  from: string;
  to: string;
}

export function processBranchData(): string[][] {
  return data.slice(0, 100).map((branch) => {
    // Parse the JSON string to get the steps array
    const steps: Step[] = JSON.parse(branch.steps);

    // Reverse the steps array and map to get only the 'to' field

    const toSteps = Array.from(new Set(steps.reverse().map((step) => step.to)));

    // const toSteps = steps.reverse().map((step) => step.to);
    toSteps.push(branch.address);

    return toSteps;
  });
}
