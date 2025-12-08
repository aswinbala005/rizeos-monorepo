"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, User, ArrowRight, Loader2, CheckCircle2, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Validation Schema ---
const signupSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // View State
  const [view, setView] = useState<"LOGIN" | "SIGNUP">("SIGNUP");
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER" | null>(null);
  const [formData, setFormData] = useState<z.infer<typeof signupSchema> | null>(null);
  
  // Status States
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema as any), // 'as any' fixes the type mismatch
  });

  // --- LOGIC: LOGIN FLOW ---
  useEffect(() => {
    if (view === "LOGIN" && isConnected && address) {
      handleLogin(address);
    }
  }, [view, isConnected, address]);
  
async function handleLogin(walletAddress: string) {
    setIsChecking(true);
    setErrorMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/users/${walletAddress}`);
      const data = await res.json();

      if (data.exists) {
        // 1. Save fetched DB data to LocalStorage (Syncs the session)
        localStorage.setItem("user_profile", JSON.stringify({
            fullName: data.user.full_name,
            email: data.user.email,
            bio: data.user.bio,
            skills: data.user.skills,
            experience: data.user.experience,
            projects: data.user.projects
        }));

        // 2. Redirect based on role
        if (data.user.role === "CANDIDATE") {
            router.push("/dashboard/seeker/jobs"); // <-- Redirect to Job Feed
        } else {
            router.push("/dashboard/recruiter");
        }
      } else {
        setErrorMessage("Account not found. Please Sign Up.");
        setIsChecking(false);
      }
    } catch (error) {
      console.error("Login Error", error);
      setErrorMessage("Failed to connect to server.");
      setIsChecking(false);
    }
  }

  // --- LOGIC: SIGNUP FLOW ---
  const onFormSubmit = (data: z.infer<typeof signupSchema>) => {
    setFormData(data);
    setSignupStep(3); // Move to Wallet Connect
  };

  // Final Registration Call
  async function handleRegistration() {
    if (!address || !formData || !role) return;
    
    setIsCreating(true);
    setErrorMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          email: formData.email,
          role: role,
          full_name: formData.fullName,
          password: formData.password, 
        }),
      });

      const data = await response.json();

      // Success OR Duplicate (User already exists) -> Redirect
      if (response.ok || JSON.stringify(data).includes("duplicate key")) {
        console.log("Registration Successful or User Exists, redirecting...");
        const target = role === "CANDIDATE" ? "/dashboard/seeker/onboarding" : "/dashboard/recruiter";
        router.push(target);
      } else {
        console.error("❌ Server Error:", data);
        setErrorMessage(data.error || "Registration failed.");
        setIsCreating(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Check backend.");
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] opacity-50" />
      </div>

      {/* Logo */}
      <div className="mb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-2xl font-bold text-gray-900">Grind<span className="text-indigo-600">Link</span></span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md relative z-10">
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button onClick={() => setView("SIGNUP")} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", view === "SIGNUP" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>Sign Up</button>
          <button onClick={() => setView("LOGIN")} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", view === "LOGIN" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>Log In</button>
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errorMessage}
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {view === "LOGIN" && (
          <div className="flex flex-col items-center py-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm mb-8">Connect your wallet to access your dashboard.</p>
            
            {isChecking ? (
              <div className="flex items-center gap-2 text-indigo-600"><Loader2 className="animate-spin" /> Verifying...</div>
            ) : (
              <ConnectButton label="Connect Wallet to Login" />
            )}
          </div>
        )}

        {/* --- VIEW: SIGNUP --- */}
        {view === "SIGNUP" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn("h-1 flex-1 rounded-full transition-colors", s <= signupStep ? "bg-indigo-600" : "bg-gray-200")} />
              ))}
            </div>

            {/* STEP 1: ROLE SELECTION */}
            {signupStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Choose your path</h2>
                <button onClick={() => { setRole("CANDIDATE"); setSignupStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group text-left">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200"><User className="w-6 h-6 text-indigo-600" /></div>
                  <div><h3 className="font-bold text-gray-900">I'm Talent</h3><p className="text-xs text-gray-500">Find jobs & earn crypto.</p></div>
                </button>
                <button onClick={() => { setRole("RECRUITER"); setSignupStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-orange-600 hover:bg-orange-50 transition-all group text-left">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200"><Briefcase className="w-6 h-6 text-orange-600" /></div>
                  <div><h3 className="font-bold text-gray-900">I'm Hiring</h3><p className="text-xs text-gray-500">Post jobs & source talent.</p></div>
                </button>
              </div>
            )}

            {/* STEP 2: REGISTRATION FORM */}
            {signupStep === 2 && (
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div className="text-center mb-6"><h2 className="text-xl font-bold text-gray-900">Create Account</h2></div>
                <div><label className="text-xs font-bold text-gray-700 uppercase">Full Name</label><input {...register("fullName")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mt-1 text-black" placeholder="John Doe" />{errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}</div>
                <div><label className="text-xs font-bold text-gray-700 uppercase">Email</label><input {...register("email")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mt-1 text-black" placeholder="john@example.com" />{errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-700 uppercase">Password</label><input type="password" {...register("password")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mt-1 text-black" placeholder="••••••" />{errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}</div>
                  <div><label className="text-xs font-bold text-gray-700 uppercase">Confirm</label><input type="password" {...register("confirmPassword")} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mt-1 text-black" placeholder="••••••" />{errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}</div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setSignupStep(1)} className="flex-1 text-black">Back</Button>
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </form>
            )}

            {/* STEP 3: WALLET CONNECTION & FINISH */}
            {signupStep === 3 && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                <p className="text-gray-500 text-sm mb-8 max-w-xs">
                  Connect your wallet to bind it to your new account: <strong>{formData?.email}</strong>
                </p>

                {/* FIX: Always show Connect Button so user can see/switch wallet */}
                <div className="mb-6">
                  <ConnectButton showBalance={false} />
                </div>

                {/* Only show Complete button if wallet is actually connected */}
                {isConnected && (
                  <Button 
                    onClick={handleRegistration} 
                    disabled={isCreating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg animate-in fade-in slide-in-from-bottom-2"
                  >
                    {isCreating ? (
                      <><Loader2 className="animate-spin mr-2" /> Creating Account...</>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                )}
                
                <button onClick={() => setSignupStep(2)} className="mt-8 text-xs text-gray-400 hover:text-gray-600">
                  Go back to details
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}