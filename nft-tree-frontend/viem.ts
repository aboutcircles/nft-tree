import { createPublicClient, http } from "viem";
import { gnosis, gnosisChiado } from "viem/chains";

const isChiado = process.env.NEXT_PUBLIC_CHAIN === "chiado";

export const publicClient = createPublicClient({
  chain: isChiado ? gnosisChiado : gnosis,
  transport: isChiado
    ? http("https://rpc.chiadochain.net")
    : http("https://rpc.gnosischain.com/"),
});
