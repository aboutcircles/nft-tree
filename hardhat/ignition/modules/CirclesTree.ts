import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import 'dotenv/config';

const CirclesTreeModule = buildModule("CirclesTreeModule", (m) => {
  const circlesTree = m.contract("CirclesTree", [process.env.MINTER_ADDRESS || '']);

  return { circlesTree };
});

export default CirclesTreeModule;
