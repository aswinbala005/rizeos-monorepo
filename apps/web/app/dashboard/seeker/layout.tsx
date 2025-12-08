import { SeekerNavbar } from "@/components/dashboard/SeekerNavbar";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SeekerNavbar />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}