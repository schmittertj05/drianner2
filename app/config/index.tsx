import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, arbitrum } from "@reown/appkit/networks"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "demo"

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks,
  projectId,
})

export const config = wagmiAdapter.wagmiConfig
