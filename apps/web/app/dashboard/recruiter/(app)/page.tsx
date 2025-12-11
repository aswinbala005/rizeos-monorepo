"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Zap, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Briefcase } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useRecruiterStats } from "@/hooks/useRecruiterStats"; // <-- Import Hook
import { CandidateListDialog } from "@/components/dashboard/CandidateListDialog";
import { useState } from "react";

// Mock Data for Chart (Keep this for visual appeal until we have historical data)
const applicationData = [
  { name: "Mon", total: 12 },
  { name: "Tue", total: 18 },
  { name: "Wed", total: 45 },
  { name: "Thu", total: 30 },
  { name: "Fri", total: 55 },
  { name: "Sat", total: 10 },
  { name: "Sun", total: 5 },
];

export default function AnalyticsDashboard() {
  // Fetch Real Stats
  const { data: jobStats, isLoading } = useRecruiterStats();
  
  // Dialog State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleJobClick = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setDialogOpen(true);
  };

  // Calculate Total Applicants dynamically
  const totalApplicants = jobStats?.reduce((acc: number, job: any) => acc + job.applicant_count, 0) || 0;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500">Track your hiring pipeline performance.</p>
      </div>

      {/* 1. Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {/* REAL DATA */}
            <div className="text-2xl font-bold text-gray-900">{totalApplicants}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Real-time count
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {/* REAL DATA */}
            <div className="text-2xl font-bold text-gray-900">{jobStats?.filter((j: any) => j.status === 'OPEN').length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Currently hiring</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">AI Match Quality</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">88%</div>
            <p className="text-xs text-gray-500 mt-1">Average candidate score</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Budget Spent</CardTitle>
            <Wallet className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.045 MATIC</div>
            <p className="text-xs text-gray-500 mt-1">Across all posts</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Charts & Lists Row */}
      <div className="grid gap-8 md:grid-cols-7">
        
        {/* Chart: Application Volume */}
        <Card className="col-span-4 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Application Volume</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={applicationData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                            {applicationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 4 ? "#ea580c" : "#fdba74"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* List: Job Performance (REAL DATA) */}
        <Card className="col-span-3 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Job Performance</CardTitle>
            <p className="text-sm text-gray-500">Applicants per active role</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading stats...</p>
                ) : !jobStats || jobStats.length === 0 ? (
                    <p className="text-sm text-gray-500">No jobs posted yet.</p>
                ) : (
                    jobStats.map((job: any) => (
                        <div 
                            key={job.id} 
                            onClick={() => handleJobClick(job.id, job.title)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                    {job.title[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                                    <p className="text-xs text-gray-500">{job.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {job.applicant_count} Applicants
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>

      </div>


      <CandidateListDialog 
        jobId={selectedJobId} 
        jobTitle={selectedJobTitle}
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
}