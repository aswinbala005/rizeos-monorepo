import { Button } from "@/components/ui/button";
import { Plus, Search, Users, Activity } from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            placeholder="Search candidates..." 
            className="bg-transparent outline-none text-sm w-full text-black"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
            PRO PLAN ACTIVE
          </span>
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/dashboard/recruiter/post-job">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Post New Job
            </Button>
          </Link>
        </div>

        {/* Widgets */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              <span className="text-green-600 text-xs font-bold">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
            <p className="text-gray-500 text-sm">Total Applicants</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg"><Activity className="w-5 h-5 text-purple-600" /></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
            <p className="text-gray-500 text-sm">Pipeline Health</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 rounded-lg"><Users className="w-5 h-5 text-orange-600" /></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-gray-500 text-sm">Interviews this week</p>
          </div>
        </div>

        {/* Active Jobs List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-900">
            Active Jobs
          </div>
          <div className="p-6 text-center text-gray-500">
            No active jobs. Click "Post New Job" to start.
          </div>
        </div>

      </main>
    </div>
  );
}