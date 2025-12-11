"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, UploadCloud, PenTool, Loader2, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

async function extractResumeData(fileUrl: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fileUrl }),
    });
    if (!response.ok) {
        const err = await response.json();
        console.error("AI Parser Error:", err);
        return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Network Error during parsing:", error);
    return null;
  }
}

export default function RecruiterOnboarding() {
  const [step, setStep] = useState<"CHOICE" | "REVIEW">("CHOICE");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { address } = useAccount();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: "", 
      email: "", // Login Email
      professionalEmail: "", // Contact Email
      jobRole: "", 
      bio: "", 
      skills: "",
      experience: "", 
      education: "", 
      phone: "", 
      organizationName: "",
      organizationLocation: "", 
      organizationBio: ""
    }
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("recruiter_email");
    if (!storedEmail) { router.push("/auth"); return; }

    async function getUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${storedEmail}`);
        const data = await res.json();
        if (data.exists) {
          setUserId(data.user.id);
          setValue("fullName", data.user.full_name || "");
          setValue("email", data.user.email || ""); // Set Login Email
        }
      } catch (e) { console.error(e); }
    }
    getUser();
  }, [setValue, router]);

  const onUploadComplete = async (res: any) => {
    setIsExtracting(true);
    const fileUrl = res[0].url;
    const data: any = await extractResumeData(fileUrl);
    
    if (data) {
      setValue("fullName", data.full_name || "");
      setValue("professionalEmail", data.email || ""); // Map to Professional Email
      setValue("jobRole", data.job_role || "Tech Recruiter");
      setValue("bio", data.bio || "");
      setValue("skills", data.skills || "");
      setValue("experience", data.experience || "");
      setValue("education", data.education || "");
    } else {
      alert("Could not parse resume automatically. Please fill manually.");
    }
    
    setIsExtracting(false);
    setStep("REVIEW");
  };

  const onSubmit = async (data: any) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          professional_email: data.professionalEmail, // Send Contact Email
          job_role: data.jobRole,
          phone: data.phone,
          bio: data.bio,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          organization_name: data.organizationName,
          organization_location: data.organizationLocation,
          organization_bio: data.organizationBio
        }),
      });

      if (response.ok) {
        localStorage.setItem("recruiter_profile", JSON.stringify({
            name: data.fullName,
            company: data.organizationName,
            jobRole: data.jobRole
        }));
        router.push("/dashboard/recruiter");
      } else {
        const err = await response.json();
        alert("Failed to save profile: " + err.error);
      }
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      
      {step === "CHOICE" && (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Build Your Profile</h1>
          <p className="text-gray-500 mb-8 text-center">Let's set up your professional identity.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-orange-100 rounded-xl p-8 flex flex-col items-center text-center hover:bg-orange-50/50 transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4"><UploadCloud className="w-8 h-8 text-orange-600" /></div>
              <h3 className="font-bold text-lg text-gray-900">Upload Your Resume</h3>
              <p className="text-sm text-gray-500 mb-6">Auto-fill personal details using AI.</p>
              {isExtracting ? <div className="flex items-center gap-2 text-orange-600 font-medium"><Loader2 className="animate-spin" /> Analyzing...</div> : <UploadButton<OurFileRouter, "resumeUploader"> endpoint="resumeUploader" onClientUploadComplete={onUploadComplete} onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)} appearance={{ button: "bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700" }} />}
            </div>
            <button onClick={() => setStep("REVIEW")} className="border-2 border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-300 hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><PenTool className="w-8 h-8 text-gray-600" /></div>
              <h3 className="font-bold text-lg text-gray-900">Fill Manually</h3>
              <p className="text-sm text-gray-500">Enter all details yourself.</p>
            </button>
          </div>
        </>
      )}

      {step === "REVIEW" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Recruiter Profile</h1>
              <p className="text-gray-500">Set up your professional identity and company details.</p>
          </div>
          
          <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100"><User className="w-5 h-5 text-orange-600" /><h3 className="font-bold text-gray-900">Your Details</h3></div>
              <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><Input {...register("fullName")} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Login Email (Read Only)</label><Input {...register("email")} disabled className="bg-gray-100" /></div>
              </div>
              
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Professional Email (Contact)</label><Input {...register("professionalEmail")} /></div>
              
              <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Your Job Title</label><Input {...register("jobRole")} placeholder="e.g. Senior Tech Recruiter" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><Input {...register("phone")} placeholder="+91..." /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label><Textarea {...register("bio")} className="h-24" placeholder="I specialize in hiring for Fintech..." /></div>
              <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills (e.g. Sourcing)</label><Input {...register("skills")} placeholder="Sourcing, Negotiation..." /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Education</label><Input {...register("education")} placeholder="MBA in HR..." /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label><Input {...register("experience")} placeholder="e.g. 5 Years" /></div>
          </div>

          <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100"><Building2 className="w-5 h-5 text-orange-600" /><h3 className="font-bold text-gray-900">Organization Details</h3></div>
              <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><Input {...register("organizationName")} placeholder="Acme Corp" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Location</label><Input {...register("organizationLocation")} placeholder="Bangalore, India" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Overview</label><Textarea {...register("organizationBio")} className="h-24" placeholder="We are building the future of..." /></div>
          </div>

          <Button type="submit" disabled={isSaving} className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg">
            {isSaving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Complete Setup"}
          </Button>
        </form>
      )}
    </div>
  );
}