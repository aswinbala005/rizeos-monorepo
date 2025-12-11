import Link from "next/link";
import { Button } from "@/components/ui/button";

import { GrindLinkLogo } from "@/components/ui/grindlink-logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-50 p-1.5 rounded-xl border border-indigo-100">
            <GrindLinkLogo className="text-indigo-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Grind<span className="text-indigo-600">Link</span>
          </span>
        </div>

        {/* Auth & Community Buttons (Right Side) */}
        <div className="flex items-center gap-6">
          {/* Community Link */}
          <Link href="/dashboard/seeker/network" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Community
          </Link>

          <div className="h-6 w-px bg-gray-200" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
                Log In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gray-900 hover:bg-black text-white px-6 rounded-full font-medium transition-all shadow-lg shadow-gray-200">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}