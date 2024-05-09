import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import 'dotenv/config';

const CirclesTreeModule = buildModule("CirclesTreeModule", (m) => {
  // Modify the script to accept start and end times as parameters
  const circlesTree = m.contract("CirclesTree", [
    process.env.MINTER_ADDRESS || '', // Minter address
    process.env.START_TIME || '',     // Start time
    process.env.END_TIME || ''        // End time
  ]);

  return { circlesTree };
});

export default CirclesTreeModule;
