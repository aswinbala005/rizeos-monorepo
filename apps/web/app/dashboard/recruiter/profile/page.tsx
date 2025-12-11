"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { Loader2, Pencil, Save, X, User, Mail, Briefcase, Code2, GraduationCap, Building2, MapPin, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function RecruiterProfilePage() {
  const { address } = useAccount();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();

  // 1. Fetch User Data by Email
  useEffect(() => {
    const storedEmail = localStorage.getItem("recruiter_email"); // <--- FIX: Use correct key
    if (!storedEmail) {
        console.warn("⚠️ No recruiter email found in localStorage");
        return;
    }

    async function fetchUser() {
      try {
        console.log(`🚀 Fetching recruiter profile for: ${storedEmail}`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${storedEmail}`);
        const data = await res.json();
        
        if (data.exists) {
            console.log("✅ Recruiter DB Data Received:", data.user);
          setUserData(data.user);
          reset({
            fullName: data.user.full_name,
            email: data.user.email,
            jobRole: data.user.job_role || "",
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            skills: data.user.skills || "",
            experience: data.user.experience || "",
            education: data.user.education || "",
            organizationName: data.user.organization_name || "",
            organizationLocation: data.user.organization_location || "",
            organizationBio: data.user.organization_bio || ""
          });
        } else {
            console.error("❌ Recruiter not found in DB");
        }
      } catch (error) { console.error("Failed to fetch profile", error); } 
      finally { setIsLoading(false); }
    }
    fetchUser();
  }, [reset]);

  // 2. Handle Update
  const onSubmit = async (data: any) => {
    if (!userData?.id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserData(updatedUser);
        
        localStorage.setItem("recruiter_profile", JSON.stringify({ 
            name: updatedUser.full_name, 
            company: updatedUser.organization_name,
            jobRole: updatedUser.job_role
        }));
        
        setIsEditing(false);
        router.refresh();
        alert("Profile Updated Successfully!");
      } else { 
        const err = await res.json();
        alert("Failed to update: " + err.error); 
      }
    } catch (error) { console.error(error); }
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-orange-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-orange-50">
                <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userData?.full_name}`} />
                <AvatarFallback>HR</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData?.full_name}</h1>
                <p className="text-orange-600 font-medium">{userData?.job_role}</p>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                    <Mail className="w-4 h-4" /><span>{userData?.email}</span>
                    <span className="text-gray-300">|</span>
                    <span>{userData?.phone}</span>
                </div>
            </div>
        </div>
        {!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"><Pencil className="w-4 h-4" /> Edit Profile</Button>}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        {!isEditing ? (
            <div className="space-y-10">
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Details</h2>
                    <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Bio</h3><p className="text-gray-700 leading-relaxed whitespace-pre-line">{userData?.bio || "No bio added."}</p></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Code2 className="w-4 h-4" /> Skills</h3><p className="text-gray-700">{userData?.skills || "Not specified"}</p></div>
                        <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Experience</h3><p className="text-gray-700">{userData?.experience || "Not specified"}</p></div>
                    </div>
                    <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</h3><p className="text-gray-700">{userData?.education || "Not specified"}</p></div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Organization Details</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" /> Company</h3><p className="text-gray-900 font-medium text-lg">{userData?.organization_name || "Not specified"}</p></div>
                        <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</h3><p className="text-gray-700">{userData?.organization_location || "Not specified"}</p></div>
                    </div>
                    <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Company Overview</h3><div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-gray-700 whitespace-pre-line">{userData?.organization_bio || "No overview added."}</div></div>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Edit Personal Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><Input {...register("fullName")} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><Input {...register("email")} /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><Input {...register("jobRole")} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><Input {...register("phone")} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><Textarea {...register("bio")} className="h-24" /></div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills</label><Input {...register("skills")} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Education</label><Input {...register("education")} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><Input {...register("experience")} /></div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Edit Organization Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><Input {...register("organizationName")} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label><Input {...register("organizationLocation")} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Overview</label><Textarea {...register("organizationBio")} className="h-24" /></div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="gap-2"><X className="w-4 h-4" /> Cancel</Button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}