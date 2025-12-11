"use client";

import { Button } from "@/components/ui/button";
import { Plus, Activity, Briefcase, Loader2, MapPin, IndianRupee, Code2, Clock, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

// Helper to format salary
const formatSalary = (job: any) => {
    if (job.is_unpaid) return "Unpaid / Internship";
    if (job.salary_min !== undefined && job.salary_max !== undefined) {
        const format = (val: number) => val >= 100000 ? `${val/100000}L` : `${val/1000}k`;
        return `₹${format(job.salary_min)} - ₹${format(job.salary_max)}`;
    }
    return "Not Disclosed";
}

export default function RecruiterHomePage() {
  const { data: allJobs, isLoading } = useRecruiterJobs();
  const queryClient = useQueryClient();

  // Filter Jobs
  const activeJobs = allJobs?.filter((job: any) => job.status === 'OPEN') || [];
  const closedJobs = allJobs?.filter((job: any) => job.status === 'CLOSED') || [];

  // --- ACTION: CLOSE JOB ---
  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to close this job?")) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/close`, { method: "PUT" });
        if (res.ok) queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] });
    } catch (e) { console.error(e); }
  };

  // --- ACTION: REOPEN JOB ---
  const handleReopenJob = async (jobId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/reopen`, { method: "PUT" });
        if (res.ok) {
            queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] });
            alert("Job Reposted Successfully!");
        }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Home</h1>
          <Link href="/dashboard/recruiter/post-job">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-lg shadow-orange-200">
              <Plus className="w-4 h-4" /> Post New Job
            </Button>
          </Link>
        </div>

        {/* Main Widgets */}
        <div className="grid md:grid-cols-2 gap-8">
            
            {/* Active Jobs (OPEN) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    Active Jobs
                </div>
                <div className="p-6 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        </div>
                    ) : activeJobs.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">You have no active jobs.</p>
                    ) : (
                        activeJobs.map((job: any) => (
                            <div key={job.id} className="p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-200 transition-colors shadow-sm relative group">
                                
                                {/* Close Button */}
                                <button 
                                    onClick={() => handleCloseJob(job.id)}
                                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Close Job"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="flex justify-between items-start mb-2 pr-6">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{job.title}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : "Just now"}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-3">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-gray-700">
                                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                                        {formatSalary(job)}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-gray-700">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        {job.location_city || "Remote"}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mt-4">
                                    <Code2 className="w-4 h-4 text-orange-500" />
                                    <div className="flex flex-wrap gap-1.5">
                                        {job.skills_requirements ? (
                                            job.skills_requirements.split(',').slice(0, 3).map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-orange-50 border border-orange-100 rounded text-[10px] font-bold text-orange-700 uppercase">
                                                    {skill.trim()}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No skills specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Activity (CLOSED JOBS) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    Recent Activity (Closed)
                </div>
                <div className="p-6 space-y-4">
                    {closedJobs.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No closed jobs.</p>
                    ) : (
                        closedJobs.map((job: any) => (
                            <div key={job.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    {/* REMOVED line-through */}
                                    <p className="font-bold text-gray-900">{job.title}</p>
                                    <p className="text-xs text-gray-500">Closed {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : ""}</p>
                                </div>
                                
                                {/* REPOST BUTTON */}
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleReopenJob(job.id)}
                                    className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-2"
                                >
                                    <RefreshCw className="w-3 h-3" /> Repost
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    </div>
  );
}