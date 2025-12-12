"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Eye, Send, Trash2, MoreHorizontal, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useApplications } from "@/hooks/useApplications";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const statusConfig = {
  SENT: { color: "bg-gray-100 text-gray-600", icon: Send, label: "Sent", step: 1 },
  DELIVERED: { color: "bg-gray-100 text-gray-600", icon: CheckCircle2, label: "Delivered", step: 2 },
  IN_REVIEW: { color: "bg-blue-50 text-blue-700 border-blue-100", icon: Clock, label: "In Review", step: 3 },
  VIEWED: { color: "bg-orange-50 text-orange-700 border-orange-100", icon: Eye, label: "Profile Viewed", step: 4 },
  DECISION: { color: "bg-green-50 text-green-700 border-green-100", icon: CheckCircle2, label: "Shortlisted", step: 5 },
};

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useApplications();
  const queryClient = useQueryClient();
  
  // State for "View Status" Modal
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application? This cannot be undone.")) return;
    
    setIsWithdrawing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${appId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh the list
        queryClient.invalidateQueries({ queryKey: ["applications"] });
      } else {
        alert("Failed to withdraw.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-600"/></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
          <p className="text-gray-500 mb-6">Start applying to jobs to track them here.</p>
          <Link href="/dashboard/seeker/jobs">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Browse Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => {
            const statusKey = (app.status || "SENT") as keyof typeof statusConfig;
            const status = statusConfig[statusKey];

            return (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{app.role}</h3>
                  <p className="text-gray-500 text-sm">{app.company} • Applied {app.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Current Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${status.color}`}>
                    <status.icon className="w-4 h-4" />
                    {status.label}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedApp(app)}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                        <Activity className="w-4 h-4 mr-2" /> View Status
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleWithdraw(app.id)}
                        disabled={isWithdrawing}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STATUS TRACKER DIALOG */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>Application Status</DialogTitle>
                <DialogDescription>
                    Tracking for <strong>{selectedApp?.role}</strong> at {selectedApp?.company}
                </DialogDescription>
            </DialogHeader>

            {/* Job Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Organization</p>
                  <p className="text-gray-900 font-semibold">{selectedApp?.company || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedApp?.location_city || "Remote"} • {selectedApp?.location_type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Salary</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedApp?.is_unpaid ? (
                      "Unpaid"
                    ) : selectedApp?.salary_min && selectedApp?.salary_max ? (
                      `${selectedApp.currency} ${selectedApp.salary_min.toLocaleString()} - ${selectedApp.salary_max.toLocaleString()}`
                    ) : (
                      "Not disclosed"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Applied On</p>
                  <p className="text-gray-900 font-semibold">{selectedApp?.date}</p>
                </div>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="py-4">
              <h4 className="font-semibold text-gray-900 mb-4">Application Progress</h4>
              <div className="space-y-6">
                {["SENT", "DELIVERED", "IN_REVIEW", "VIEWED", "DECISION"].map((stepKey, index) => {
                    const config = statusConfig[stepKey as keyof typeof statusConfig];
                    const currentStatusKey = (selectedApp?.status || "SENT") as keyof typeof statusConfig;
                    const currentStepIndex = ["SENT", "DELIVERED", "IN_REVIEW", "VIEWED", "DECISION"].indexOf(currentStatusKey);
                    
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={stepKey} className="flex gap-4 relative">
                            {/* Connecting Line */}
                            {index !== 4 && (
                                <div className={`absolute left-[15px] top-8 w-0.5 h-8 ${isCompleted ? "bg-indigo-600" : "bg-gray-200"}`} />
                            )}
                            
                            {/* Icon Circle */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                isCompleted ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                            }`}>
                                <config.icon className="w-4 h-4" />
                            </div>

                            {/* Text */}
                            <div>
                                <h4 className={`text-sm font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                    {config.label}
                                </h4>
                                {isCurrent && (
                                    <p className="text-xs text-indigo-600 font-medium mt-0.5">Current Stage</p>
                                )}
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}