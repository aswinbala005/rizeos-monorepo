"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Search, GraduationCap, Briefcase, X, Loader2, Target, Code2, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useJobs } from "@/hooks/useJobs"; 
import { useAccount } from "wagmi";
import { MatchBadge } from "@/components/ui/match-badge";

export default function JobFeed() {
  const [selectedJob, setSelectedJob] = useState<any>(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const router = useRouter();
  const { address } = useAccount();

  const { data: jobs, isLoading, error } = useJobs();

  // --- SORTING LOGIC IS HERE ---
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    let result = jobs.filter((job: any) => 
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.stack.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // This is where the sorting happens
    if (sortBy === "match") {
      result.sort((a: any, b: any) => b.match - a.match);
    } else if (sortBy === "salary") {
      // Sorts from highest salary to lowest
      result.sort((a: any, b: any) => b.salary - a.salary); 
    } else if (sortBy === "date") {
      result.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [jobs, searchQuery, sortBy]);

  const handleApply = async (job: any) => {
    try {
        // Get user email from localStorage (from login)
        const userEmail = localStorage.getItem("user_email") || localStorage.getItem("seeker_email");
        
        if (!userEmail && !address) {
            alert("Please log in or connect wallet first");
            return;
        }

        // Use email if logged in, otherwise use wallet address
        const identifier = userEmail || address;
        
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${identifier}`);
        const userData = await userRes.json();
        if (!userData.exists) {
            alert("User account not found. Please register.");
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                job_id: job.id,
                candidate_id: userData.user.id,
                match_score: job.match_score || 50,
                gateway_answer: "Auto-applied via Feed" 
            })
        });
        if (response.ok) {
            alert("Application submitted successfully!");
            router.push("/dashboard/seeker/applications");
        } else {
            const err = await response.json();
            alert("Failed to apply: " + (err.error || "Unknown error"));
        }
    } catch (e) {
        console.error(e);
        alert("Network error. Check console.");
    }
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-600"/></div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load jobs. Is the backend running?</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* SEARCH & SORT BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by role, company, or skill..." 
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
            {/* --- THE UI FOR SORTING IS HERE --- */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-10 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="salary">Salary (High-Low)</SelectItem>
                <SelectItem value="date">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* JOB LIST */}
      {filteredJobs.length === 0 ? (
         <div className="text-center p-10 text-gray-500 bg-white rounded-xl border border-gray-200">
            No jobs found.
         </div>
      ) : (
        filteredJobs.map((job: any) => (
            <motion.div 
            key={job.id} 
            layout 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedJob(job)} 
            >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-xl">
                            {job.logo}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{job.role}</h3>
                            <p className="text-gray-500 text-sm">{job.company}</p>
                        </div>
                    </div>
                    <MatchBadge score={job.match} />
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="font-medium text-gray-700">{job.salaryDisplay}</div>
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {job.location}</div>
                </div>

                <div className="flex gap-2 mb-4">
                    {job.stack.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{tech}</span>
                    ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 text-sm truncate flex-1">
                            {job.mission}
                        </p>
                        <button className="text-indigo-600 text-sm font-bold hover:underline whitespace-nowrap">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
            </motion.div>
        ))
      )}

      {/* FULL DESCRIPTION DIALOG */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
            
            <DialogHeader className="p-6 border-b border-gray-100 bg-white shrink-0">
                <DialogTitle className="text-2xl font-bold">{selectedJob?.role}</DialogTitle>
                <DialogDescription className="text-lg text-gray-600 mt-1">
                    {selectedJob?.company} • {selectedJob?.location}
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="space-y-8">
                    
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
                            <Target className="w-4 h-4" /> Job Description
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {selectedJob?.mission}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Key Responsibilities
                        </h3>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {selectedJob?.description}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Education
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-100 text-gray-700">
                            {selectedJob?.education}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob?.keySkills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-full font-medium shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg" onClick={() => { handleApply(selectedJob); setSelectedJob(null); }}>
                    Apply for this Job
                </Button>
            </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}