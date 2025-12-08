"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function PostJob() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Job Data:", data);
    // Call Backend POST /jobs
    alert("Job Posted! (Check Console)");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input {...register("title")} className="w-full p-3 border rounded-lg text-black" placeholder="e.g. Senior Go Engineer" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <select {...register("salary")} className="w-full p-3 border rounded-lg text-black">
                <option>£40k - £60k</option>
                <option>£60k - £80k</option>
                <option>£80k - £120k</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select {...register("location")} className="w-full p-3 border rounded-lg text-black">
                <option>Remote</option>
                <option>London, UK</option>
                <option>New York, USA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea {...register("description")} className="w-full p-3 border rounded-lg h-40 text-black" placeholder="Paste requirements here..." />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="font-bold text-indigo-900 text-sm mb-2">✨ AI Gateway Suggestion</h4>
            <p className="text-indigo-700 text-xs mb-3">Based on your description, we suggest asking:</p>
            <div className="bg-white p-3 rounded border border-indigo-100 text-sm text-gray-700">
              "Explain how you handle database migrations in a production Go environment."
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="text-black">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Publish Job (0.001 MATIC)
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}