"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, PenTool, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

async function extractResumeData(fileUrl: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fileUrl }),
    });
    if (!response.ok) throw new Error("Parsing failed");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Onboarding() {
  const [step, setStep] = useState<"CHOICE" | "REVIEW">("CHOICE");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const { address } = useAccount();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      jobRole: "",
      bio: "",
      skills: "",
      experience: "",
      projects: "", // We use a string representation here for easy editing
      education: ""
    }
  });

  useEffect(() => {
    if (!address) return;
    async function getUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${address}`);
        const data = await res.json();
        if (data.exists) {
          setUserId(data.user.id);
          setValue("fullName", data.user.full_name || "");
          setValue("email", data.user.email || "");
        }
      } catch (e) { console.error("Failed to fetch user", e); }
    }
    getUser();
  }, [address, setValue]);

  const onUploadComplete = async (res: any) => {
    setIsExtracting(true);
    const fileUrl = res[0].url;
    const data: any = await extractResumeData(fileUrl);
    
    if (data) {
      setValue("fullName", data.full_name || "");
      setValue("email", data.email || "");
      setValue("jobRole", data.job_role || "");
      setValue("bio", data.bio || "");
      setValue("skills", data.skills || "");
      setValue("experience", data.experience || "");
      setValue("education", data.education || "");
      
      // Convert Project Array to String for the Textarea
      // Format: "Title: X\nSummary: Y\n\n"
      let projectsText = "";
      if (Array.isArray(data.projects)) {
        projectsText = data.projects.map((p: any) => `Title: ${p.title}\nSummary: ${p.summary}`).join('\n\n');
      }
      setValue("projects", projectsText);
    } else {
      alert("Could not parse resume automatically. Please fill manually.");
    }
    
    setIsExtracting(false);
    setStep("REVIEW");
  };

  const onSubmit = async (data: any) => {
    if (!userId) {
      alert("User not found. Please connect wallet.");
      return;
    }
    setIsSaving(true);
    try {
      // Parse the Projects String back into an Array
      const projectEntries = data.projects.split('Title: ').filter(Boolean).map((entry: string) => {
        const parts = entry.split('\nSummary: ');
        return { 
            title: parts[0]?.trim(), 
            summary: parts[1]?.trim() 
        };
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          job_role: data.jobRole,
          bio: data.bio,
          skills: data.skills,
          experience: data.experience,
          projects: projectEntries, // Send Array
          education: data.education
        }),
      });

      if (response.ok) {
        localStorage.setItem("user_profile", JSON.stringify(data));
        router.push("/dashboard/seeker/jobs");
      } else {
        const err = await response.json();
        alert("Failed to save profile: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Profile</h1>
        <p className="text-gray-500 mb-8">Let's get you ready for the best technical jobs.</p>

        {step === "CHOICE" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-indigo-100 rounded-xl p-8 flex flex-col items-center text-center hover:bg-indigo-50/50 transition-colors">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"><UploadCloud className="w-8 h-8 text-indigo-600" /></div>
              <h3 className="font-bold text-lg text-gray-900">Upload Resume</h3>
              <p className="text-sm text-gray-500 mb-6">Auto-fill using AI (Speed)</p>
              {isExtracting ? <div className="flex items-center gap-2 text-indigo-600 font-medium"><Loader2 className="animate-spin" /> Analyzing...</div> : <UploadButton<OurFileRouter, "resumeUploader"> endpoint="resumeUploader" onClientUploadComplete={onUploadComplete} onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)} appearance={{ button: "bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700" }} />}
            </div>
            <button onClick={() => setStep("REVIEW")} className="border-2 border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-300 hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><PenTool className="w-8 h-8 text-gray-600" /></div>
              <h3 className="font-bold text-lg text-gray-900">Fill Manually</h3>
              <p className="text-sm text-gray-500">Type it yourself (Precision)</p>
            </button>
          </div>
        )}

        {step === "REVIEW" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div><h4 className="font-bold text-indigo-900 text-sm">Profile Review</h4><p className="text-indigo-700 text-xs">Please review the data below.</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input {...register("fullName")} className="w-full p-3 border rounded-lg text-black" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input {...register("email")} className="w-full p-3 border rounded-lg text-black" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Role / Title</label><input {...register("jobRole")} className="w-full p-3 border rounded-lg text-black" placeholder="e.g. ML Engineer" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label><textarea {...register("bio")} className="w-full p-3 border rounded-lg h-24 text-black" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills</label><input {...register("skills")} className="w-full p-3 border rounded-lg text-black" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Education</label><input {...register("education")} className="w-full p-3 border rounded-lg text-black" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Projects / Portfolio</label><textarea {...register("projects")} className="w-full p-3 border rounded-lg h-24 text-black" placeholder="Title: Project Name&#10;Summary: Description..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label><input {...register("experience")} className="w-full p-3 border rounded-lg text-black" /></div>
            <Button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">
              {isSaving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Submit Application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}