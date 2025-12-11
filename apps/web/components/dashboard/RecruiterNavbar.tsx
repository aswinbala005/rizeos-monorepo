"use client";

import Link from "next/link";
import { LogOut, LayoutDashboard, Bot, Wallet, User, ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useDisconnect, useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { GrindLinkLogo } from "@/components/ui/grindlink-logo";

// Mock Transaction History
const transactions = [
  { id: 1, action: "Post: Senior Go Engineer", amount: "0.001 MATIC", date: "Just now", status: "Confirmed" },
  { id: 2, action: "Post: React Frontend Dev", amount: "0.001 MATIC", date: "2 days ago", status: "Confirmed" },
];

export function RecruiterNavbar() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const [profile, setProfile] = useState({ name: "Recruiter", company: "Company", jobRole: "Hiring Manager" });

  useEffect(() => {
    const stored = localStorage.getItem("recruiter_profile");
    if (stored) {
        const data = JSON.parse(stored);
        setProfile({
            name: data.name || "Recruiter",
            company: data.company || "Company",
            jobRole: data.jobRole || "Hiring Manager"
        });
    }
  }, []);

  const handleLogout = () => {
    disconnect();
    // FIX: Clear all session keys
    localStorage.removeItem("seeker_email");
    localStorage.removeItem("recruiter_email");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("recruiter_profile");
    localStorage.removeItem("user_email"); // <--- FIX: Clear generic email key
    localStorage.removeItem("my_applications");
    router.push("/auth");
  };

  const displayBalance = balance ? parseFloat(balance.formatted).toFixed(4) : "0.0157";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <Link href="/dashboard/recruiter" className="flex items-center gap-2.5">
          <div className="bg-orange-50 p-1.5 rounded-xl border border-orange-100">
            <div className="text-orange-600"><GrindLinkLogo /></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Grind<span className="text-orange-600">Link</span>
          </span>
          <span className="ml-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold tracking-wide">HIRING</span>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-6">
            <Link href="/dashboard/recruiter/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>

            
            <Link href="/dashboard/recruiter/agents" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI Agents
            </Link>            
            <Link href="/dashboard/recruiter/network" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" /> Community
            </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* WALLET DIALOG */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors border border-gray-200">
                <Wallet className="w-4 h-4 text-orange-600" />
                <span>{displayBalance} MATIC</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-orange-600" /> Wallet Details
                </DialogTitle>
                <DialogDescription>
                    Your transaction history for job postings.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-orange-600 font-bold uppercase">Current Balance</p>
                        <p className="text-2xl font-bold text-gray-900">{displayBalance} <span className="text-sm font-normal text-gray-500">MATIC</span></p>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowUpRight className="w-5 h-5 text-orange-600" />
                    </div>
                </div>

                <h4 className="text-sm font-bold text-gray-900 mb-3">Recent Transactions</h4>
                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{tx.action}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">-{tx.amount}</p>
                                <p className="text-[10px] text-green-600 font-medium">{tx.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* PROFILE SIDEBAR (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${profile.name}`} />
                  <AvatarFallback>HR</AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="mb-6 text-left">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-orange-100">
                    <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${profile.name}`} />
                    <AvatarFallback>HR</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg font-bold">{profile.name}</SheetTitle>
                    <p className="text-xs text-gray-500 line-clamp-1">{profile.jobRole}</p>
                    <p className="text-[10px] text-orange-600 font-medium mt-0.5">{profile.company}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-2">
                <Link href="/dashboard/recruiter/profile">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 h-12">
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