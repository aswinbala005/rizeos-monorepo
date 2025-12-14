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

// Hack to suppress WalletConnect and Browser Extension warnings
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalGroupCollapsed = console.groupCollapsed;

  const shouldSuppress = (msg: any) => {
    const txt = msg?.toString() || "";
    return (
      txt.includes("WalletConnect Core is already initialized") ||
      txt.includes("SES Removing") ||
      txt.includes("lockdown-install") ||
      txt.includes("intrinsics")
    );
  };

  console.warn = (...args) => {
    if (shouldSuppress(args[0])) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    if (shouldSuppress(args[0])) return;
    originalError(...args);
  };

  console.groupCollapsed = (...args) => {
    if (shouldSuppress(args[0])) return;
    originalGroupCollapsed(...args);
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