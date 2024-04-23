import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
require('dotenv').config()

// mnemonic
const mnemonic = process.env.MNEMONIC

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
      blockGasLimit: 10000000,
      // accounts: { mnemonic }
      // allowUnlimitedContractSize: true
    },
    gnosis: {
      url: "https://rpc.gnosischain.com/",
      chainId: 100,
      blockGasLimit: 10000000,
      accounts: [process.env.PRIVATE_KEY || '']
      // accounts: { mnemonic }
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      chainId: 10200,
      blockGasLimit: 10000000,
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  etherscan: {
    apiKey: process.env.GNOSISSCAN_API_KEY
  }
};

export default config;
