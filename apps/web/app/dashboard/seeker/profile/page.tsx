"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { Loader2, Pencil, Save, X, User, Mail, Briefcase, Code2, FileText, GraduationCap, Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { address } = useAccount();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const { register, handleSubmit, reset, control } = useForm();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    if (!address) return;
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${address}`);
        const data = await res.json();
        if (data.exists) {
          
          // --- THE FIX IS HERE ---
          // 1. Parse projects from JSON string to Array
          let projectsData = data.user.projects;
          if (typeof projectsData === 'string') {
            try {
              projectsData = JSON.parse(projectsData);
            } catch (e) {
              projectsData = [];
            }
          }
          
          // 2. Update the user object with the parsed array
          const userWithParsedProjects = {
            ...data.user,
            projects: Array.isArray(projectsData) ? projectsData : []
          };

          // 3. Set State for View Mode
          setUserData(userWithParsedProjects);
          
          // 4. Set Form Data for Edit Mode
          reset({
            fullName: data.user.full_name,
            email: data.user.email,
            jobRole: data.user.job_role || "",
            bio: data.user.bio || "",
            skills: data.user.skills || "",
            experience: data.user.experience || "",
            projects: userWithParsedProjects.projects, // Use the parsed array
            education: data.user.education || ""
          });
        }
      } catch (error) { console.error("Failed to fetch profile", error); } 
      finally { setIsLoading(false); }
    }
    fetchUser();
  }, [address, reset]);

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
        
        // Parse projects again for the UI update
        let projectsData = updatedUser.projects;
        if (typeof projectsData === 'string') {
            try { projectsData = JSON.parse(projectsData); } catch (e) { projectsData = []; }
        }
        
        const finalUser = { ...updatedUser, projects: projectsData };
        
        setUserData(finalUser);
        localStorage.setItem("user_profile", JSON.stringify({ fullName: finalUser.full_name, jobRole: finalUser.job_role }));
        setIsEditing(false);
        router.refresh();
        alert("Profile Updated Successfully!");
      } else { alert("Failed to update profile."); }
    } catch (error) { console.error(error); }
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-indigo-50">
                <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${userData?.full_name}`} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData?.full_name}</h1>
                <p className="text-indigo-600 font-medium">{userData?.job_role}</p>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm"><Mail className="w-4 h-4" /><span>{userData?.email}</span></div>
            </div>
        </div>
        {!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"><Pencil className="w-4 h-4" /> Edit Profile</Button>}
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        {!isEditing ? (
            <div className="space-y-8">
                <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4" /> About Me</h3><p className="text-gray-700 leading-relaxed whitespace-pre-line">{userData?.bio || "No bio added yet."}</p></div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Code2 className="w-4 h-4" /> Skills</h3><div className="flex flex-wrap gap-2">{userData?.skills ? userData.skills.split(',').map((skill: string) => (<span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">{skill.trim()}</span>)) : <span className="text-gray-400 italic">No skills listed</span>}</div></div>
                    <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Experience</h3><p className="text-gray-700 font-medium">{userData?.experience || "Not specified"}</p></div>
                </div>
                <div><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</h3><p className="text-gray-700 font-medium">{userData?.education || "Not specified"}</p></div>
                
                {/* VIEW MODE: PROJECTS */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Projects</h3>
                    <div className="space-y-4">
                        {userData?.projects && Array.isArray(userData.projects) && userData.projects.length > 0 ? (
                            userData.projects.map((project: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{project.summary}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No projects added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            /* --- EDIT MODE --- */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><Input {...register("fullName")} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><Input {...register("email")} /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Role / Title</label><Input {...register("jobRole")} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label><Textarea {...register("bio")} className="h-24" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label><Input {...register("skills")} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Education</label><Input {...register("education")} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label><Input {...register("experience")} /></div>
                
                {/* EDIT MODE: DYNAMIC PROJECTS */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Projects & Achievements</label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => append({ title: "", summary: "" })} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="space-y-2">
                                    <Input {...register(`projects.${index}.title`)} placeholder="Project Title" className="font-bold" />
                                    <Textarea {...register(`projects.${index}.summary`)} placeholder="Project Summary" className="h-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="gap-2"><X className="w-4 h-4" /> Cancel</Button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}