"use client";

import { SeekerNavbar } from "@/components/dashboard/SeekerNavbar";
import { usePathname } from "next/navigation";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("/onboarding");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isOnboarding && <SeekerNavbar />}
      <main className={isOnboarding ? "flex items-center justify-center min-h-screen p-6" : "max-w-7xl mx-auto p-6"}>
        {children}
      </main>
    </div>
  );
}