import { createPublicClient, http } from 'viem'
import { gnosis, gnosisChiado } from 'viem/chains'
 
export const publicClient = createPublicClient({ 
  chain: gnosis, 
  transport: http("https://rpc.gnosischain.com/"),
}) 