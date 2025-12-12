"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles, User, Briefcase, ChevronRight, Zap, Target, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";


import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRecruiterJobs } from "@/hooks/useRecruiterJobs";

// --- HOOKS ---
function useTracerSearch(query: string) {
    return useQuery({
        queryKey: ["tracerSearch", query],
        queryFn: async () => {
            if (!query) return [];
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Search failed");
            return res.json();
        },
        enabled: false, // Manual trigger
    });
}

function useFayeScreening() {
    return useQuery({
        queryKey: ["fayeScreening"],
        queryFn: async () => {
            const email = localStorage.getItem("recruiter_email");
            if (!email) return [];
            
            // 1. Get User ID
            const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`);
            const userData = await userRes.json();
            if (!userData.exists) return [];

            // 2. Get All Applications
            const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/recruiter/${userData.user.id}`);
            if (!appRes.ok) throw new Error("Fetch failed");
            return appRes.json();
        },
        refetchInterval: 10000, // Auto-refresh every 10 seconds  
        refetchOnWindowFocus: true, // Refresh when window regains focus
    });
}

// --- COMPONENTS ---

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("tracer");

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BotIcon className="w-8 h-8 text-orange-600" /> AI Agents
        </h1>
        <p className="text-gray-500">Deploy autonomous agents to Source and Screen talent.</p>
      </div>

      <Tabs defaultValue="tracer" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="tracer" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Tracer (Sourcing)
          </TabsTrigger>
          <TabsTrigger value="faye" className="flex items-center gap-2">
            <Target className="w-4 h-4" /> Faye (Screening)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracer" className="space-y-4">
            <TracerAgent />
        </TabsContent>

        <TabsContent value="faye" className="space-y-4">
            <FayeAgent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- TRACER AGENT (SOURCING) ---
function TracerAgent() {
    const [input, setInput] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
        { role: 'ai', content: "Hello! I'm Tracer. Tell me who you're looking for (e.g., 'React Developer with Go experience')." }
    ]);
    
    // Better Logic: Search State
    const [searchQuery, setSearchQuery] = useState("");
    const { data: candidates, isLoading: isSearching, refetch: triggerSearch } = useTracerSearch(searchQuery);

    const onSearch = () => {
        if (!input) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setSearchQuery(input);
        setTimeout(() => triggerSearch(), 100); 
        setMessages(prev => [...prev, { role: 'ai', content: `Searching database for "${input}"...` }]);
        setInput("");
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat Interface */}
            <Card className="lg:col-span-1 flex flex-col border-orange-100 shadow-md">
                <CardHeader className="bg-orange-50/50 border-b border-orange-100 pb-4">
                    <CardTitle className="text-orange-700 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Chat with Tracer</CardTitle>
                    <CardDescription>Natural Language Sourcing</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isSearching && <div className="text-xs text-gray-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Tracer is thinking...</div>}
                        </div>
                    </ScrollArea>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Input 
                            placeholder="Type a query..." 
                            value={input} 
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && onSearch()}
                            className="bg-gray-50 border-gray-200"
                        />
                        <Button onClick={onSearch} size="icon" className="bg-orange-600 hover:bg-orange-700"><Send className="w-4 h-4" /></Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Interface */}
            <Card className="lg:col-span-2 border-gray-200 shadow-sm flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-50">
                    <CardTitle>Sourced Candidates</CardTitle>
                    <CardDescription>
                        {candidates?.length ? `Found ${candidates.length} potential matches` : "Results will appear here"}
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex-1 p-6 bg-gray-50/30">
                    {!candidates && !isSearching && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Sparkles className="w-12 h-12 mb-2 opacity-20" />
                            <p>Ask Tracer to find candidates.</p>
                        </div>
                    )}

                    {candidates && candidates.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No candidates found matching that query.</div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        {candidates?.map((c: any) => (
                            <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-gray-100">
                                            <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${c.full_name}`} />
                                            <AvatarFallback>{c.full_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{c.full_name}</h4>
                                            <p className="text-xs text-orange-600 font-medium">{c.job_role || "Candidate"}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-100">95% Match</Badge>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {c.skills?.split(',').slice(0, 3).map((s: string, i: number) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">{s.trim()}</span>
                                    ))}
                                </div>
                                <Button 
                                    onClick={() => setSelectedCandidate(c)}
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full text-xs h-8 group-hover:bg-orange-50 group-hover:text-orange-700 group-hover:border-orange-200"
                                >
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* DYNAMIC PROFILE DIALOG */}
            <CandidateProfileDialog 
                candidate={selectedCandidate} 
                isOpen={!!selectedCandidate} 
                onClose={() => setSelectedCandidate(null)} 
            />
        </div>
    );
}

// --- FAYE AGENT (SCREENING) ---
function FayeAgent() {
    const { data: applications, isLoading: isLoadingApps } = useFayeScreening();
    const { data: jobs, isLoading: isLoadingJobs } = useRecruiterJobs();
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    if (isLoadingApps || isLoadingJobs) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-600"/></div>;

    // Toggle logic for Accordion
    const toggleJob = (jobId: string) => {
        setExpandedJobId(expandedJobId === jobId ? null : jobId);
    };

    return (
        <div className="space-y-6 h-[700px] overflow-y-auto pr-2 pb-10">
            {jobs?.map((job: any) => {
                const jobApps = applications?.filter((app: any) => app.job_id === job.id) || [];
                const highSignal = jobApps.filter((app: any) => (app.match_score || 0) >= 80);
                const potentialFit = jobApps.filter((app: any) => (app.match_score || 0) >= 50 && (app.match_score || 0) < 80);
                const lowSignal = jobApps.filter((app: any) => (app.match_score || 0) < 50);

                const isExpanded = expandedJobId === job.id;

                return (
                    <Card key={job.id} className="border border-gray-100 shadow-sm overflow-hidden">
                        <div 
                            className="bg-white p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                            onClick={() => toggleJob(job.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                    <p className="text-xs text-gray-500">{jobApps.length} Candidates Screened</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Preview Stats Badges */}
                                {highSignal.length > 0 && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">{highSignal.length} Top Matches</Badge>}
                                {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-4 grid lg:grid-cols-3 gap-6 bg-gray-50/30">
                                {/* Bucket 1: High Signal */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> High Signal
                                    </h4>
                                    <div className="space-y-3">
                                        {highSignal.map((app: any) => (
                                            <CandidateCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
                                        ))}
                                        {highSignal.length === 0 && <p className="text-xs text-gray-400 italic">No candidates yet.</p>}
                                    </div>
                                </div>

                                {/* Bucket 2: Potential Fits */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Potential Fits
                                    </h4>
                                    <div className="space-y-3">
                                        {potentialFit.map((app: any) => (
                                            <CandidateCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
                                        ))}
                                        {potentialFit.length === 0 && <p className="text-xs text-gray-400 italic">No candidates yet.</p>}
                                    </div>
                                </div>

                                {/* Bucket 3: Low Signal */}
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div> Low Signal
                                    </h4>
                                    <div className="space-y-3">
                                        {lowSignal.map((app: any) => (
                                            <CandidateCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
                                        ))}
                                        {lowSignal.length === 0 && <p className="text-xs text-gray-400 italic">No candidates yet.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}

            {/* Replaced Sidebar with Sheet for Better UX */}
            
            {/* Reused Profile Dialog */}
            <CandidateProfileDialog 
                isOpen={!!selectedApp} 
                onClose={() => setSelectedApp(null)} 
                candidate={selectedApp?.candidate || selectedApp?.user}
                app={selectedApp}
            />
        </div>
    );
}

// Extracted Card Component for cleaner code
function CandidateCard({ app, onClick }: { app: any, onClick: () => void }) {
    // Helper to extract string from PG type locally or rely on dialog normalization
    const getText = (val: any) => {
        if (!val) return "";
        if (typeof val === 'string') return val;
        if (val?.String) return val.String;
        return "";
    };

    // Handling flat structure from GetAllApplicationsByRecruiter
    const name = getText(app.candidate_name) || app.candidate?.full_name || "Unknown";
    const role = getText(app.candidate_role) || app.candidate?.job_role || "Applicant";

    return (
        <Card 
            className="p-3 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-orange-500 group"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-100 text-orange-700">{name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <h4 className="font-semibold text-sm truncate group-hover:text-orange-700">{name}</h4>
                    <p className="text-xs text-gray-500 truncate">{role}</p>
                </div>
                {(app.match_score || 0) > 0 && (
                    <div className="ml-auto">
                        <Badge variant="secondary" className={app.match_score >= 80 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {app.match_score}%
                        </Badge>
                    </div>
                )}
            </div>
        </Card>
    );
}

// --- REUSABLE CANDIDATE PROFILE DIALOG ---
function CandidateProfileDialog({ candidate, app, isOpen, onClose }: { candidate: any, app?: any, isOpen: boolean, onClose: () => void }) {
    if (!candidate && !app) return null;

    // Helper to safely extract text from potential PG object or string
    const getText = (val: any) => {
        if (!val) return "";
        if (typeof val === 'string') return val;
        if (val && typeof val === 'object' && 'String' in val) return val.String; // Handle Go pgtype.Text
        if (val && typeof val === 'object' && 'string' in val) return val.string; // Case safety
        return "";
    };

    // Normalize candidate data if it comes from the flat application object
    const effectiveCandidate = candidate || {
        full_name: getText(app?.candidate_name) || "Unknown Candidate",
        job_role: getText(app?.candidate_role) || "Applicant",
        skills: getText(app?.candidate_skills),
        experience: getText(app?.candidate_experience),
        education: getText(app?.candidate_education), // Added Education
        bio: getText(app?.candidate_bio) || "No bio available.", 
        id: app?.candidate_id
    };

    // Use safe parsing similar to Seeker Profile to handle JSON/Strings
    const parseData = (data: any) => {
        if (!data) return null;
        if (Array.isArray(data)) return data;
        if (typeof data === 'object') return [data]; // Single object
        if (typeof data === 'string') {
            const trimmed = data.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                try { 
                    const parsed = JSON.parse(data);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch { return data; } // Return as string if parse fails
            }
            return data; // Return as string
        }
        return null;
    };
    
    // Parse skills (string or array)
    const skills = typeof effectiveCandidate.skills === 'string' 
        ? effectiveCandidate.skills.split(',').filter((s: string) => s.trim().length > 0)
        : (Array.isArray(effectiveCandidate.skills) ? effectiveCandidate.skills : []);

    const experience = parseData(effectiveCandidate.experience);
    const education = parseData(effectiveCandidate.education);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader className="mb-6 text-left">
                    <div className="flex items-center gap-4">
                         <Avatar className="h-20 w-20 border-4 border-orange-50">
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">
                                {effectiveCandidate.full_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">{effectiveCandidate.full_name}</DialogTitle>
                            <p className="text-lg text-gray-500">{effectiveCandidate.job_role}</p>
                            <div className="flex gap-2 mt-2">
                                {app?.match_score > 0 && (
                                    <Badge variant="secondary" className={app.match_score >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                        {app.match_score}% Match
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* AI Analysis (If match score exists) */}
                    {app?.match_score && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                Faye's Analysis
                            </h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                {effectiveCandidate.full_name} is a <strong>{app.match_score}% match</strong> for this role.
                                {app.match_score >= 80 
                                    ? " They have strong overlap with the required skills and experience level." 
                                    : " They have some matching skills but might lack specific requirements."}
                            </p>
                        </div>
                    )}



                    {/* Bio */}
                    <div>
                         <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                         <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {effectiveCandidate.bio || "No bio available."}
                         </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Top Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 bg-gray-50">
                                    {skill}
                                </Badge>
                            ))}
                            {skills.length === 0 && <p className="text-sm text-gray-400 italic">No skills listed.</p>}
                        </div>
                    </div>

                    {/* Experience */}
                     <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                        <div className="space-y-4">
                             {Array.isArray(experience) && experience.length > 0 ? (
                                experience.map((exp: any, i: number) => (
                                    <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900">{exp.role || "Role"}</h5>
                                            <p className="text-sm text-gray-500">{exp.company || ""} {exp.duration ? `• ${exp.duration}` : ""}</p>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                typeof experience === 'string' ? (
                                    <p className="text-gray-700 whitespace-pre-line">{experience}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No experience listed.</p>
                                )
                             )}
                        </div>
                    </div>
                    
                    {/* Education */}
                     <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
                        <div className="space-y-4">
                             {Array.isArray(education) && education.length > 0 ? (
                                education.map((edu: any, i: number) => (
                                    <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900">{edu.degree || "Degree"}</h5>
                                            <p className="text-sm text-gray-500">{edu.institution || ""} {edu.year ? `• ${edu.year}` : ""}</p>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                typeof education === 'string' ? (
                                    <p className="text-gray-700 whitespace-pre-line">{education}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No education listed.</p>
                                )
                             )}
                        </div>
                    </div>

                {/* Footer Buttons */}

                </div>

            </DialogContent>
        </Dialog>
    );
}

function BotIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
        </svg>
    )
}

