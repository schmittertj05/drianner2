"use client";
import { wagmiAdapter, projectId } from "../config";
import { createAppKit } from "@reown/appkit";
import { mainnet, arbitrum, avalanche } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project Id is not defined");
}

const metadata = {
  name: "LOL",
  description: "LOL"
};

// Définition manuelle des réseaux
const bsc = {
  id: 56,
  name: "Binance Smart Chain",
  network: "bsc",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: ["https://bsc-dataseed.binance.org/"] },
    default: { http: ["https://bsc-dataseed.binance.org/"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
};

const base = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.base.org"] },
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
};

const linea = {
  id: 59144,
  name: "Linea",
  network: "linea",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.linea.build"] },
    default: { http: ["https://rpc.linea.build"] },
  },
  blockExplorers: {
    default: { name: "LineaScan", url: "https://lineascan.build" },
  },
};

const polygon = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: {
    decimals: 18,
    name: "Matic",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: { http: ["https://polygon-rpc.com"] },
    default: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "Polygonscan", url: "https://polygonscan.com" },
  },
};

const blast = {
  id: 81457,
  name: "Blast",
  network: "blast",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.blast.io"] },
    default: { http: ["https://rpc.blast.io"] },
  },
  blockExplorers: {
    default: { name: "Blastscan", url: "https://blastscan.io" },
  },
};

const aurora = {
  id: 1313161554,
  name: "Aurora",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.aurora.dev"] },
    default: { http: ["https://mainnet.aurora.dev"] },
  },
  blockExplorers: {
    default: { name: "Aurorascan", url: "https://aurorascan.dev" },
  },
};

const degen = {
  id: 666666666,
  name: "Degen",
  network: "degen",
  nativeCurrency: {
    decimals: 18,
    name: "Degen",
    symbol: "DEGEN",
  },
  rpcUrls: {
    public: { http: ["https://rpc.degen.chain"] },
    default: { http: ["https://rpc.degen.chain"] },
  },
  blockExplorers: {
    default: { name: "DegenScan", url: "https://explorer.degen.chain" },
  },
};

const scroll = {
  id: 534352,
  name: "Scroll",
  network: "scroll",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.scroll.io"] },
    default: { http: ["https://rpc.scroll.io"] },
  },
  blockExplorers: {
    default: { name: "Scrollscan", url: "https://scrollscan.com" },
  },
};

const pulse = {
  id: 369,
  name: "Pulse",
  network: "pulse",
  nativeCurrency: {
    decimals: 18,
    name: "Pulse",
    symbol: "PLS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.pulsechain.com"] },
    default: { http: ["https://rpc.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.pulsechain.com" },
  },
};

const mantle = {
  id: 5000,
  name: "Mantle",
  network: "mantle",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: { http: ["https://rpc.mantle.xyz"] },
    default: { http: ["https://rpc.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "MantleScan", url: "https://explorer.mantle.xyz" },
  },
};

const fuse = {
  id: 122,
  name: "Fuse",
  network: "fuse",
  nativeCurrency: {
    decimals: 18,
    name: "Fuse",
    symbol: "FUSE",
  },
  rpcUrls: {
    public: { http: ["https://rpc.fuse.io"] },
    default: { http: ["https://rpc.fuse.io"] },
  },
  blockExplorers: {
    default: { name: "FuseExplorer", url: "https://explorer.fuse.io" },
  },
};

const cronos = {
  id: 25,
  name: "Cronos",
  network: "cronos",
  nativeCurrency: {
    decimals: 18,
    name: "Cronos",
    symbol: "CRO",
  },
  rpcUrls: {
    public: { http: ["https://evm.cronos.org"] },
    default: { http: ["https://evm.cronos.org"] },
  },
  blockExplorers: {
    default: { name: "Cronoscan", url: "https://cronoscan.com" },
  },
};

// Ajout de Fantom
const fantom = {
  id: 250,
  name: "Fantom",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    public: { http: ["https://rpc.ftm.tools"] },
    default: { http: ["https://rpc.ftm.tools"] },
  },
  blockExplorers: {
    default: { name: "FTMScan", url: "https://ftmscan.com" },
  },
};

// Ajout de Dogechain
const dogechain = {
  id: 2000,
  name: "Dogechain",
  network: "dogechain",
  nativeCurrency: {
    decimals: 18,
    name: "Doge",
    symbol: "DOGE",
  },
  rpcUrls: {
    public: { http: ["https://rpc01.dogechain.dog"] },
    default: { http: ["https://rpc01.dogechain.dog"] },
  },
  blockExplorers: {
    default: { name: "Dogechain Explorer", url: "https://explorer.dogechain.dog" },
  },
};

// Création du modal avec tous les réseaux ajoutés
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [
    mainnet,
    arbitrum,
    avalanche,
    bsc,
    base,
    linea,
    polygon,
    blast,
    aurora,
    degen,
    scroll,
    pulse,
    mantle,
    fuse,
    cronos,
    fantom,
    dogechain,
  ],
  defaultNetwork: undefined,
  features: {
    analytics: true,
    email: false,
    socials: false,
    emailShowWallets: false,
  },
  themeMode: "dark",
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
