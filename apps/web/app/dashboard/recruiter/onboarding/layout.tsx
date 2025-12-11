import { GrindLinkLogo } from "@/components/ui/grindlink-logo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Minimal Themed Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="bg-orange-50 p-1.5 rounded-xl border border-orange-100">
            <GrindLinkLogo className="text-orange-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Grind<span className="text-orange-600">Link</span>
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">HIRING</span>
          </span>
        </div>
      </div>
      
      {/* The Page Content (The Form) */}
      {children}
    </div>
  );
}