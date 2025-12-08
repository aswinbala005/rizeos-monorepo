"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useRef, useState } from "react";

export function SignInButton() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // Ref to prevent double-firing in React Strict Mode
  const hasRequested = useRef(false);

  useEffect(() => {
    // Only run if connected, have an address, and haven't requested yet
    if (isConnected && address && !hasRequested.current) {
      registerUser(address);
    }
  }, [isConnected, address]);

  async function registerUser(walletAddress: string) {
    try {
      hasRequested.current = true; // Mark as requested immediately
      setStatus("loading");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("❌ NEXT_PUBLIC_API_URL is not set");
        return;
      }

      console.log(`🚀 Syncing user: ${walletAddress}`);

      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          email: `user_${walletAddress.slice(0, 6)}@rizeos.com`, // Placeholder
          role: "CANDIDATE",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ User Created:", data);
        setStatus("success");
      } else {
        // Check if it's a duplicate error (User already exists)
        // The backend returns 500 for duplicates currently
        if (JSON.stringify(data).includes("duplicate key")) {
            console.log("👋 User already exists. Logged in successfully.");
            setStatus("success");
        } else {
            console.error("❌ Backend Error:", data);
            setStatus("error");
            hasRequested.current = false; // Allow retry if it was a real error
        }
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setStatus("error");
      hasRequested.current = false;
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <ConnectButton />
      {status === "loading" && <span className="text-xs text-yellow-500">Syncing profile...</span>}
      {status === "success" && <span className="text-xs text-green-500">● Synced with RizeOS</span>}
      {status === "error" && <span className="text-xs text-red-500">Sync failed</span>}
    </div>
  );
}