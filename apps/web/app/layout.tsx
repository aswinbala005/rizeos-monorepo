import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "../providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrindLink",
  description: "The Proof-of-Skill Protocol",
};

// apps/web/app/layout.tsx
// ... imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* REMOVED className="dark" */}
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}