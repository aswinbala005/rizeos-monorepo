"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Wallet, ArrowLeft, CheckCircle2, Briefcase, MapPin, IndianRupee } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const [step, setStep] = useState<"DETAILS" | "PAYMENT">("DETAILS");
  const [isPosting, setIsPosting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, getValues } = useForm({
    defaultValues: {
      title: "",
      locationType: "",
      locationCity: "",
      summary: "",
      description: "",
      education: "",
      skills: "",
      isUnpaid: false,
      salaryMin: "",
      salaryMax: "",
      currency: "INR"
    }
  });

  const isUnpaid = watch("isUnpaid");
  const locationType = watch("locationType");
  const formValues = getValues(); 

  const router = useRouter();
  const { address } = useAccount();

  const onDetailsSubmit = (data: any) => {
    setStep("PAYMENT");
  };

  const handlePayAndPublish = async () => {
    if (!address) return alert("Connect Wallet");
    saveJobToBackend();
  };

  const saveJobToBackend = async () => {
    setIsPosting(true);
    try {
        // Get User ID and Email
        const storedEmail = localStorage.getItem("recruiter_email");
        if (!storedEmail) {
            alert("Login session expired. Please relogin.");
            setIsPosting(false);
            return;
        }

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${storedEmail}`);
        const userData = await userRes.json();
        
        if (!userData.exists) {
            alert("User error. Please relogin.");
            setIsPosting(false);
            return;
        }

        const data = getValues();

        // Call POST /jobs
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recruiter_id: userData.user.id,
                recruiter_email: storedEmail, // <-- NEW
                title: data.title,
                description: data.description,
                job_summary: data.summary,
                education_requirements: data.education,
                skills_requirements: data.skills,
                job_type: "Full-time", 
                location_type: data.locationType,
                location_city: data.locationType === "Remote" ? "Remote" : data.locationCity,
                is_unpaid: data.isUnpaid,
                salary_min: parseInt(data.salaryMin) || 0,
                salary_max: parseInt(data.salaryMax) || 0,
                currency: data.currency || "INR"
            })
        });

        if (response.ok) {
            alert("Job Posted Successfully!");
            router.push("/dashboard/recruiter");
        } else {
            const err = await response.json();
            alert("Failed to save job: " + err.error);
            setIsPosting(false);
        }
    } catch (e) {
        console.error(e);
        alert("Network error.");
        setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded transition-colors ${step === "DETAILS" || step === "PAYMENT" ? "bg-orange-600" : "bg-gray-200"}`} />
            <div className={`h-1 flex-1 rounded transition-colors ${step === "PAYMENT" ? "bg-orange-600" : "bg-gray-200"}`} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {step === "DETAILS" ? "Job Details" : "Review & Publish"}
        </h1>

        {step === "DETAILS" && (
            <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-6 animate-in fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="text-sm font-medium">Job Title</label><Input {...register("title")} placeholder="Senior Go Engineer" required /></div>
                    <div><label className="text-sm font-medium">Job Type</label>
                        <Select onValueChange={(v) => setValue("locationType", v)} required>
                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                            <SelectContent><SelectItem value="Remote">Remote</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="In-Office">In-Office</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>

                {(locationType === "Hybrid" || locationType === "In-Office") && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium">Job Location (City)</label>
                        <Input {...register("locationCity")} placeholder="e.g. Bangalore, India" required />
                    </div>
                )}

                <div><label className="text-sm font-medium">Job Summary / Mission</label><Textarea {...register("summary")} className="h-20" placeholder="What will they build?" required /></div>
                <div><label className="text-sm font-medium">Key Responsibilities</label><Textarea {...register("description")} className="h-32" placeholder="Bullet points..." required /></div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="text-sm font-medium">Education</label><Input {...register("education")} placeholder="B.Tech / M.Tech" /></div>
                    <div><label className="text-sm font-medium">Skills</label><Input {...register("skills")} placeholder="Go, Postgres, AWS" required /></div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Checkbox id="unpaid" onCheckedChange={(c: boolean) => setValue("isUnpaid", c)} />
                    <label htmlFor="unpaid" className="text-sm font-medium cursor-pointer">This is an Unpaid Role / Internship</label>
                </div>

                {!isUnpaid && (
                    <div className="grid md:grid-cols-3 gap-4">
                        <div><label className="text-sm font-medium">Min Salary</label><Input type="number" {...register("salaryMin")} /></div>
                        <div><label className="text-sm font-medium">Max Salary</label><Input type="number" {...register("salaryMax")} /></div>
                        <div><label className="text-sm font-medium">Currency</label><Input {...register("currency")} defaultValue="INR" /></div>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Next: Review</Button>
                </div>
            </form>
        )}

        {step === "PAYMENT" && (
            <div className="space-y-8 animate-in fade-in">
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" /> Review Job Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-200 pb-4">
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formValues.title}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {formValues.locationType}</span>
                                    {formValues.locationType !== "Remote" && (
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {formValues.locationCity}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-green-700 flex items-center justify-end gap-1">
                                    <IndianRupee className="w-4 h-4" /> 
                                    {formValues.isUnpaid ? "Unpaid" : `${formValues.salaryMin} - ${formValues.salaryMax}`}
                                </p>
                                <p className="text-xs text-gray-400">{formValues.currency}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-gray-700 mb-1">Skills Required</p>
                            <div className="flex flex-wrap gap-2">
                                {formValues.skills?.split(',').map((s: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">{s.trim()}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center py-6">
                    {isPosting ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Publishing Job...</h3>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                                <Wallet className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Publish?</h2>
                            <p className="text-gray-500 mb-8">Fee: <strong>0.000 MATIC</strong> (Test Mode)</p>
                            
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" onClick={() => setStep("DETAILS")} className="gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Back to Edit
                                </Button>
                                <Button 
                                    onClick={handlePayAndPublish} 
                                    className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-lg shadow-lg shadow-green-200"
                                >
                                    Publish Job (Test Mode)
                                </Button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        )}

      </div>
    </div>
  );
}