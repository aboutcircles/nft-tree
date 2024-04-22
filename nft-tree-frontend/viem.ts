import { createPublicClient, http } from 'viem'
import { gnosisChiado } from 'viem/chains'
 
export const publicClient = createPublicClient({ 
  chain: gnosisChiado, 
  transport: http("https://rpc.chiadochain.net"),
}) 