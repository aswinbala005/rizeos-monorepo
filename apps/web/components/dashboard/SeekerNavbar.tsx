"use client";

import Link from "next/link";
import { Bell, LogOut, Briefcase, User, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { GrindLinkLogo } from "@/components/ui/grindlink-logo";

export function SeekerNavbar() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const [userProfile, setUserProfile] = useState({ fullName: "User", jobRole: "Developer" });

  useEffect(() => {
    const stored = localStorage.getItem("user_profile");
    if (stored) {
      setUserProfile(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    // 1. Disconnect Wallet
    disconnect();
    
    // 2. Wipe ALL Local Storage Data
    localStorage.removeItem("seeker_email");
    localStorage.removeItem("recruiter_email");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("recruiter_profile");
    localStorage.removeItem("user_email"); // <--- FIX: Clear generic email key
    localStorage.removeItem("my_applications");
    
    // 3. Redirect to Auth
    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link href="/dashboard/seeker/jobs" className="flex items-center gap-2.5">
          <div className="bg-indigo-50 p-1.5 rounded-xl border border-indigo-100 text-indigo-600">
            <GrindLinkLogo />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden md:block">
            Grind<span className="text-indigo-600">Link</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Community Link */}
          <Link href="/dashboard/seeker/network" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Community
          </Link>

          {/* PROFILE SIDEBAR */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userProfile.fullName}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="mb-6 text-left">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-indigo-100">
                    <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userProfile.fullName}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg font-bold">{userProfile.fullName}</SheetTitle>
                    <p className="text-xs text-gray-500 line-clamp-1">{userProfile.jobRole}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-2">
                <Link href="/dashboard/seeker/applications">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 h-12">
                    <Briefcase className="w-5 h-5" />
                    My Applications
                  </Button>
                </Link>
                
                <Link href="/dashboard/seeker/profile">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 h-12">
                    <User className="w-5 h-5" />
                    My Profile
                  </Button>
                </Link>

                <div className="my-4 border-t border-gray-100" />

                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 h-12"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </nav>
  );
}