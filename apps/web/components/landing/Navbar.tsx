import Link from "next/link";
import { Button } from "@/components/ui/button";

// Custom GrindLink Logo Component
const GrindLinkLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-indigo-600"
  >
    <path
      d="M6 10C6 7.79086 7.79086 6 10 6H16C18.2091 6 20 7.79086 20 10V12H16V10H10V22H16V20H14V16H20V22C20 24.2091 18.2091 26 16 26H10C7.79086 26 6 24.2091 6 22V10Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M26 22C26 24.2091 24.2091 26 22 26H16V22H22V10H16V6H22C24.2091 6 26 7.79086 26 10V22Z"
      fill="currentColor"
    />
    <rect x="12" y="14" width="8" height="4" rx="2" fill="currentColor" />
  </svg>
);

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-50 p-1.5 rounded-xl border border-indigo-100">
            <GrindLinkLogo />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Grind<span className="text-indigo-600">Link</span>
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#jobs" className="hover:text-indigo-600 transition-colors">Find Jobs</Link>
          <Link href="#network" className="hover:text-indigo-600 transition-colors">Community</Link>
          <Link href="#companies" className="hover:text-indigo-600 transition-colors">For Companies</Link>
        </div>

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
    </nav>
  );
}