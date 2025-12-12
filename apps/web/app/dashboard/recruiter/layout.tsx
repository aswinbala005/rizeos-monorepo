"use client";

import { RecruiterNavbar } from "@/components/dashboard/RecruiterNavbar";
import { usePathname } from "next/navigation";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("/onboarding");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isOnboarding && <RecruiterNavbar />}
      <main className={isOnboarding ? "flex items-center justify-center min-h-screen p-6" : "max-w-7xl mx-auto p-6"}>
        {children}
      </main>
    </div>
  );
}