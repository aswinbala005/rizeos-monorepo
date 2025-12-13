"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
// Optimization: Importing from viem/chains is lighter than wagmi/chains
import { polygonAmoy } from "viem/chains";
// FIX: These were missing
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

// Hack to suppress WalletConnect warning
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.toString().includes("WalletConnect Core is already initialized")) return;
    originalWarn(...args);
  };
}

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "RizeOS",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [polygonAmoy],
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}