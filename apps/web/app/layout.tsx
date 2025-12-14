import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const Web3Provider = dynamic(
  () => import("../providers/Web3Provider").then((mod) => mod.Web3Provider),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrindLink",
  description: "The Proof-of-Skill Protocol",
};

// apps/web/app/layout.tsx
// ... imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning> {/* REMOVED className="dark" */}
      <body className={inter.className} suppressHydrationWarning>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}