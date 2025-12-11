"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, User, ArrowRight, Loader2, CheckCircle2, Wallet, AlertCircle, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GrindLinkLogo } from "@/components/ui/grindlink-logo";

// --- Validation Schemas ---
const signupSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function AuthPageContent() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // --- THEME & FLOW LOGIC ---
  const flowRole = searchParams.get("role");
  const isRecruiterFlow = flowRole === "recruiter";
  const theme = {
    bg: isRecruiterFlow ? "bg-orange-600 hover:bg-orange-700" : "bg-indigo-600 hover:bg-indigo-700",
    text: isRecruiterFlow ? "text-orange-600" : "text-indigo-600",
    ring: isRecruiterFlow ? "focus:ring-orange-500" : "focus:ring-indigo-500",
  };

  const [view, setView] = useState<"LOGIN" | "SIGNUP">("SIGNUP");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<z.infer<typeof signupSchema> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signupForm = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema as any) });
  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema as any) });

  // --- HELPER: CLEAR SESSION ---
  const clearSession = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("seeker_email");
    localStorage.removeItem("recruiter_email");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("recruiter_profile");
  };

  // --- LOGIC: LOGIN FLOW ---
  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    clearSession(); // <--- Clear previous session data
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (response.ok) {
        // Save to role-specific keys
        if (result.user.role === "RECRUITER") {
            localStorage.setItem("recruiter_email", result.user.email);
            localStorage.setItem("recruiter_profile", JSON.stringify({ name: result.user.full_name, company: result.user.organization_name, jobRole: result.user.job_role }));
            router.push("/dashboard/recruiter");
        } else {
            localStorage.setItem("seeker_email", result.user.email);
            localStorage.setItem("user_email", result.user.email); // <--- FIX: For Onboarding Page
            localStorage.setItem("user_profile", JSON.stringify({ fullName: result.user.full_name, jobRole: result.user.job_role }));
            router.push("/dashboard/seeker/jobs");
        }
      } else {
        setErrorMessage(result.error || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOGIC: SIGNUP FLOW ---
  const onSignupFormSubmit = (data: z.infer<typeof signupSchema>) => {
    setFormData(data);
    setSignupStep(2);
  };

  async function handleRegistration() {
    if (!address || !formData) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    clearSession(); // <--- Clear previous session data
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          email: formData.email,
          role: isRecruiterFlow ? "RECRUITER" : "CANDIDATE",
          full_name: formData.fullName,
          password: formData.password, 
        }),
      });
      const data = await response.json();
      
      if (response.ok || JSON.stringify(data).includes("duplicate")) {
        // Save to role-specific keys
        if (isRecruiterFlow) {
            localStorage.setItem("recruiter_email", formData.email);
            router.push("/dashboard/recruiter/onboarding");
        } else {
            localStorage.setItem("seeker_email", formData.email);
            localStorage.setItem("user_email", formData.email); // <--- FIX: For Onboarding Page
            router.push("/dashboard/seeker/onboarding");
        }
      } else {
        setErrorMessage(data.error || "Registration failed.");
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMessage("Network error.");
      setIsSubmitting(false);
    }
  }

  // --- RENDER LOGIC ---
  if (!flowRole) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className={`p-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600`}>
              <GrindLinkLogo />
            </div>
            <span className="text-2xl font-bold text-gray-900">Grind<span className="text-indigo-600">Link</span></span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Choose your path</h2>
            <Link href="/auth?role=seeker" className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 group">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200"><User className="w-6 h-6 text-indigo-600" /></div>
              <div><h3 className="font-bold text-gray-900">I'm Talent</h3><p className="text-xs text-gray-500">Find jobs & earn crypto.</p></div>
            </Link>
            <Link href="/auth?role=recruiter" className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-orange-600 hover:bg-orange-50 group">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200"><Briefcase className="w-6 h-6 text-orange-600" /></div>
              <div><h3 className="font-bold text-gray-900">I'm Hiring</h3><p className="text-xs text-gray-500">Post jobs & source talent.</p></div>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className={`p-1.5 rounded-xl ${isRecruiterFlow ? 'bg-orange-50 border-orange-100' : 'bg-indigo-50 border-indigo-100'} border`}>
            <div className={theme.text}><GrindLinkLogo /></div>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Grind<span className={theme.text}>Link</span>
            {isRecruiterFlow && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">HIRING</span>}
          </span>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button onClick={() => setView("SIGNUP")} className={cn("flex-1 py-2 text-sm font-medium rounded-lg", view === "SIGNUP" ? "bg-white shadow-sm" : "text-gray-500")}>Sign Up</button>
          <button onClick={() => setView("LOGIN")} className={cn("flex-1 py-2 text-sm font-medium rounded-lg", view === "LOGIN" ? "bg-white shadow-sm" : "text-gray-500")}>Log In</button>
        </div>
        {errorMessage && <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm"><AlertCircle className="w-4 h-4" /> {errorMessage}</div>}
        
        {view === "LOGIN" && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6"><h2 className="text-xl font-bold text-gray-900">Welcome Back</h2><p className="text-sm text-gray-500">Enter your credentials.</p></div>
            <div><label className="text-xs font-bold text-gray-700 uppercase">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input {...loginForm.register("email")} placeholder="e.g. john@example.com" className={`pl-10 ${theme.ring}`} /></div></div>
            <div><label className="text-xs font-bold text-gray-700 uppercase">Password</label><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input type="password" {...loginForm.register("password")} placeholder="••••••••" className={`pl-10 ${theme.ring}`} /></div></div>
            <Button type="submit" disabled={isSubmitting} className={`w-full text-white ${theme.bg}`}>{isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Logging in...</> : "Log In"}</Button>
          </form>
        )}

        {view === "SIGNUP" && (
          <div>
            <div className="flex gap-2 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className={cn("h-1 flex-1 rounded-full", s <= signupStep ? theme.bg : "bg-gray-200")} />
              ))}
            </div>
            {signupStep === 1 && (
              <form onSubmit={signupForm.handleSubmit(onSignupFormSubmit)} className="space-y-4">
                <div className="text-center mb-6"><h2 className="text-xl font-bold text-gray-900">Create Account</h2></div>
                <div><label className="text-xs font-bold text-gray-700 uppercase">Full Name</label><Input {...signupForm.register("fullName")} placeholder="e.g. John Doe" className={theme.ring} />{signupForm.formState.errors.fullName && <p className="text-red-500 text-xs">{signupForm.formState.errors.fullName.message}</p>}</div>
                <div><label className="text-xs font-bold text-gray-700 uppercase">Email</label><Input {...signupForm.register("email")} placeholder="e.g. john@example.com" className={theme.ring} />{signupForm.formState.errors.email && <p className="text-red-500 text-xs">{signupForm.formState.errors.email.message}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-gray-700 uppercase">Password</label><Input type="password" {...signupForm.register("password")} placeholder="••••••••" className={theme.ring} />{signupForm.formState.errors.password && <p className="text-red-500 text-xs">{signupForm.formState.errors.password.message}</p>}</div>
                  <div><label className="text-xs font-bold text-gray-700 uppercase">Confirm</label><Input type="password" {...signupForm.register("confirmPassword")} placeholder="••••••••" className={theme.ring} />{signupForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{signupForm.formState.errors.confirmPassword.message}</p>}</div>
                </div>
                <Button type="submit" className={`w-full text-white ${theme.bg}`}>Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </form>
            )}
            {signupStep === 2 && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-8 h-8 text-green-600" /></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                <p className="text-gray-500 text-sm mb-8">Connect your wallet to bind it to your account.</p>
                <div className="mb-6"><ConnectButton showBalance={false} /></div>
                {isConnected && <Button onClick={handleRegistration} disabled={isSubmitting} className={`w-full h-12 text-lg text-white ${theme.bg}`}>{isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Creating...</> : "Complete Registration"}</Button>}
                <button onClick={() => setSignupStep(1)} className="mt-8 text-xs text-gray-400 hover:text-gray-600">Go back</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}