"use client";

import Link from "next/link";
import { Bell, LogOut, Briefcase, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

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
    disconnect();
    localStorage.removeItem("user_profile");
    localStorage.removeItem("my_applications");
    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <Link href="/dashboard/seeker/jobs" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-bold text-gray-900 hidden md:block">Grind<span className="text-indigo-600">Link</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard/seeker/network" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Community
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px]">
              <SheetHeader className="mb-4 text-left"><SheetTitle>Notifications</SheetTitle></SheetHeader>
              <div className="space-y-3">
                <div onClick={() => router.push("/dashboard/seeker/applications")} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Application Viewed</p>
                      <p className="text-xs text-gray-600">Nexus Tech just viewed your profile.</p>
                      <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg font-bold">{userProfile.fullName}</SheetTitle>
                    <p className="text-xs text-gray-500 line-clamp-1">{userProfile.jobRole}</p>
                  </div>
                </div>
              </SheetHeader>
              <div className="space-y-2">
                <Link href="/dashboard/seeker/applications"><Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 h-12"><Briefcase className="w-5 h-5" /> My Applications</Button></Link>
                <Link href="/dashboard/seeker/profile"><Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 h-12"><User className="w-5 h-5" /> My Profile</Button></Link>
                <div className="my-4 border-t border-gray-100" />
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 h-12" onClick={handleLogout}><LogOut className="w-5 h-5" /> Log Out</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}