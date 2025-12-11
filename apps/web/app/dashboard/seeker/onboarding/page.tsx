"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, PenTool, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

// Helper to call the Backend AI Parser
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
  // State Management
  const [step, setStep] = useState<"CHOICE" | "REVIEW">("CHOICE");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const { address } = useAccount(); // Kept for context, but not used for lookup

  // Form Setup
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: "",
      email: "",            // Login Email (Read Only)
      professionalEmail: "", // Contact Email (From Resume)
      jobRole: "",
      bio: "",
      skills: "",
      experience: "",
      projects: "",         // Textarea string representation
      education: ""
    }
  });

  // 1. Fetch User Data using Email (Identity Source of Truth)
  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    console.log("🔍 Checking LocalStorage for email:", storedEmail);

    if (!storedEmail) {
        console.warn("❌ No email found. Redirecting to Auth.");
        router.push("/auth");
        return;
    }

    async function getUser() {
      try {
        console.log(`🚀 Fetching user data for: ${storedEmail}`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${storedEmail}`);
        const data = await res.json();
        
        if (data.exists) {
          console.log("✅ User found:", data.user);
          setUserId(data.user.id); // <--- Critical: Sets the UUID for updates
          
          // Pre-fill form with existing DB data (if any)
          setValue("fullName", data.user.full_name || "");
          setValue("email", data.user.email || ""); // Set Login Email
          
          // If they are returning to this page, pre-fill other fields
          if (data.user.bio) setValue("bio", data.user.bio);
          if (data.user.skills) setValue("skills", data.user.skills);
          if (data.user.job_role) setValue("jobRole", data.user.job_role);
          if (data.user.professional_email) setValue("professionalEmail", data.user.professional_email);
        } else {
            console.error("❌ User does not exist in DB");
        }
      } catch (e) { 
          console.error("❌ Failed to fetch user API", e); 
      }
    }
    getUser();
  }, [setValue, router]);

  // 2. Handle Resume Upload & AI Parsing
  const onUploadComplete = async (res: any) => {
    setIsExtracting(true);
    const fileUrl = res[0].url;
    console.log("🚀 Resume Uploaded, starting AI extraction...");
    
    const data: any = await extractResumeData(fileUrl);
    
    if (data) {
      console.log("✅ AI Data Received:", data);
      
      // Fill Form Fields
      setValue("fullName", data.full_name || "");
      // Map resume email to professionalEmail, NOT login email
      setValue("professionalEmail", data.email || ""); 
      setValue("jobRole", data.job_role || "");
      setValue("bio", data.bio || "");
      setValue("skills", data.skills || "");
      setValue("experience", data.experience || "");
      setValue("education", data.education || "");
      
      // Convert Project Array -> String for Textarea editing
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

  // 3. Submit Final Profile to Database
  const onSubmit = async (data: any) => {
    console.log("🔵 Submitting Profile...");
    
    if (!userId) {
      alert("User ID missing. Please try refreshing the page or re-login.");
      return;
    }
    
    setIsSaving(true);
    try {
      // Parse Projects String -> Array of Objects
      let projectEntries = [];
      const rawProjects = data.projects.trim();

      if (rawProjects) {
        // Split by "Title:" keyword
        const splitProjects = rawProjects.split(/Title:\s*/).filter(Boolean);
        
        if (splitProjects.length > 0) {
            projectEntries = splitProjects.map((entry: string) => {
                const parts = entry.split(/\nSummary:\s*/);
                return { 
                    title: parts[0]?.trim() || "Untitled Project", 
                    summary: parts[1]?.trim() || "No summary provided." 
                };
            });
        } else {
            // Fallback if user deleted "Title:" format
            projectEntries = [{ title: "My Project", summary: rawProjects }];
        }
      }

      // Send PUT Request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          // Do NOT send 'email' (Login Email) to avoid overwriting
          professional_email: data.professionalEmail, // Send Contact Email
          job_role: data.jobRole,
          bio: data.bio,
          skills: data.skills,
          experience: data.experience,
          projects: projectEntries, // Send as Array
          education: data.education
        }),
      });

      if (response.ok) {
        // Update LocalStorage for Navbar
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

        {/* STEP 1: CHOICE */}
        {step === "CHOICE" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Option */}
            <div className="border-2 border-dashed border-indigo-100 rounded-xl p-8 flex flex-col items-center text-center hover:bg-indigo-50/50 transition-colors">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Upload Resume</h3>
              <p className="text-sm text-gray-500 mb-6">Auto-fill using AI (Speed)</p>
              
              {isExtracting ? (
                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                  <Loader2 className="animate-spin" /> Analyzing...
                </div>
              ) : (
                <UploadButton<OurFileRouter, "resumeUploader">
                  endpoint="resumeUploader"
                  onClientUploadComplete={onUploadComplete}
                  onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                  appearance={{
                    button: "bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  }}
                />
              )}
            </div>

            {/* Manual Option */}
            <button 
              onClick={() => setStep("REVIEW")}
              className="border-2 border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PenTool className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Fill Manually</h3>
              <p className="text-sm text-gray-500">Type it yourself (Precision)</p>
            </button>
          </div>
        )}

        {/* STEP 2: REVIEW FORM */}
        {step === "REVIEW" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">Profile Review</h4>
                <p className="text-indigo-700 text-xs">Please review the data below.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register("fullName")} className="w-full p-3 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login Email (Read Only)</label>
                <input {...register("email")} disabled className="w-full p-3 border rounded-lg text-gray-500 bg-gray-100" />
              </div>
            </div>

            {/* NEW FIELD: Professional Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Email (Contact)</label>
                <input {...register("professionalEmail")} className="w-full p-3 border rounded-lg text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role / Title</label>
              <input {...register("jobRole")} className="w-full p-3 border rounded-lg text-black" placeholder="e.g. ML Engineer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
              <textarea {...register("bio")} className="w-full p-3 border rounded-lg h-24 text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input {...register("skills")} className="w-full p-3 border rounded-lg text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input {...register("education")} className="w-full p-3 border rounded-lg text-black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Projects / Portfolio</label>
              <textarea 
                {...register("projects")} 
                className="w-full p-3 border rounded-lg h-24 text-black" 
                placeholder="Title: Project Name&#10;Summary: Description..." 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input {...register("experience")} className="w-full p-3 border rounded-lg text-black" />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">
              {isSaving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Submit Application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}