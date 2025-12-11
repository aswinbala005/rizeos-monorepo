"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, Briefcase, Award, Zap } from "lucide-react";

interface Candidate {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_role: string;
  candidate_skills: string;
  candidate_experience: string;
  match_score: number;
  gateway_answer: string;
  status: string;
  created_at: string;
}

interface CandidateListDialogProps {
  jobId: string | null;
  jobTitle: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function CandidateListDialog({ jobId, jobTitle, open, onOpenChange }: CandidateListDialogProps) {
  
  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await fetch(`${API_URL}/jobs/${jobId}/applications`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return await res.json();
    },
    enabled: !!jobId && open, // Only fetch when dialog is open and we have a jobId
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-xl">Applicants for {jobTitle}</DialogTitle>
          <DialogDescription>
             Review and manage candidates for this role.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                    <p className="text-sm text-gray-500">Loading candidates...</p>
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500 text-sm">
                    Failed to load candidates.
                </div>
            ) : !candidates || candidates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="font-medium text-gray-900 mb-1">No applicants yet</p>
                    <p className="text-xs">Candidates will appear here once they apply.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {candidates.map((candidate: Candidate) => (
                        <div key={candidate.id} className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all bg-white shadow-sm">
                             <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${candidate.candidate_name}`} />
                                        <AvatarFallback>{candidate.candidate_name?.[0] || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{candidate.candidate_name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {candidate.candidate_role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                                        <Zap className="w-3 h-3 fill-orange-700" /> {candidate.match_score}% Match
                                    </div>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(candidate.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                             </div>

                             <div className="space-y-2 pl-[52px]">
                                {candidate.candidate_skills && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {candidate.candidate_skills.split(",").slice(0, 5).map((skill, i) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 font-normal hover:bg-gray-200">
                                                {skill.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                
                                {candidate.gateway_answer && (
                                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs text-gray-600 mt-2">
                                        <span className="font-semibold text-gray-900 block mb-1">Gateway Answer:</span>
                                        "{candidate.gateway_answer}"
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                                    <a href={`mailto:${candidate.candidate_email}`} className="text-xs font-medium text-gray-600 hover:text-orange-600 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> {candidate.candidate_email}
                                    </a>
                                     <span className="text-xs text-gray-400">|</span>
                                    <span className="text-xs text-gray-600">{candidate.candidate_experience || "0"} years exp</span>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
