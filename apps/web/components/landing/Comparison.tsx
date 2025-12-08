import { X, Check, Minus } from "lucide-react";

export function Comparison() {
  return (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Don't settle for the status quo.
          </h2>
          <p className="text-lg text-gray-500">
            See why top talent is switching from traditional job boards to GrindLink.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="grid md:grid-cols-3 gap-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Column 1: Features Labels (Hidden on mobile) */}
          <div className="hidden md:flex flex-col bg-gray-50/50">
            <div className="h-24 border-b border-gray-200 p-6 flex items-end font-semibold text-gray-400 uppercase tracking-wider text-xs">
              Features
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 border-b border-gray-200 text-sm font-medium text-gray-700">
              Application Response Time
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 border-b border-gray-200 text-sm font-medium text-gray-700">
              Skill Verification
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 border-b border-gray-200 text-sm font-medium text-gray-700">
              Salary Transparency
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 border-b border-gray-200 text-sm font-medium text-gray-700">
              Networking Value
            </div>
            <div className="flex-1 flex flex-col justify-center p-6 text-sm font-medium text-gray-700">
              Spam Messages
            </div>
          </div>

          {/* Column 2: Traditional Job Boards */}
          <div className="flex flex-col bg-white border-r border-gray-200 md:border-r-0">
            <div className="h-24 border-b border-gray-200 p-6 flex flex-col justify-center">
              <span className="font-bold text-gray-900 text-lg">Traditional Boards</span>
              <span className="text-xs text-gray-500">LinkedIn, Indeed, etc.</span>
            </div>
            
            {/* Row 1 */}
            <div className="flex-1 p-6 border-b border-gray-200 flex items-center gap-3 text-gray-500">
              <Minus className="w-5 h-5 text-gray-300 md:hidden" />
              <span>Weeks or never (Ghosting)</span>
            </div>
            {/* Row 2 */}
            <div className="flex-1 p-6 border-b border-gray-200 flex items-center gap-3 text-gray-500">
              <X className="w-5 h-5 text-red-400" />
              <span>None (Resume based)</span>
            </div>
            {/* Row 3 */}
            <div className="flex-1 p-6 border-b border-gray-200 flex items-center gap-3 text-gray-500">
              <X className="w-5 h-5 text-red-400" />
              <span>"Competitive" (Hidden)</span>
            </div>
            {/* Row 4 */}
            <div className="flex-1 p-6 border-b border-gray-200 flex items-center gap-3 text-gray-500">
              <Minus className="w-5 h-5 text-gray-300 md:hidden" />
              <span>Awkward Cold DMs</span>
            </div>
            {/* Row 5 */}
            <div className="flex-1 p-6 flex items-center gap-3 text-gray-500">
              <Check className="w-5 h-5 text-gray-400" />
              <span>High (Recruiter Spam)</span>
            </div>
          </div>

          {/* Column 3: GrindLink (Highlighted) */}
          <div className="flex flex-col bg-indigo-50/30 relative">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
            
            <div className="h-24 border-b border-indigo-100 p-6 flex flex-col justify-center">
              <span className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                GrindLink
                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
              </span>
              <span className="text-xs text-indigo-600/80">The Future of Work</span>
            </div>

            {/* Row 1 */}
            <div className="flex-1 p-6 border-b border-indigo-100 flex items-center gap-3 text-gray-900 font-medium">
              <Check className="w-5 h-5 text-indigo-600" />
              <span>48 Hours Guaranteed</span>
            </div>
            {/* Row 2 */}
            <div className="flex-1 p-6 border-b border-indigo-100 flex items-center gap-3 text-gray-900 font-medium">
              <Check className="w-5 h-5 text-indigo-600" />
              <span>AI & Blockchain Verified</span>
            </div>
            {/* Row 3 */}
            <div className="flex-1 p-6 border-b border-indigo-100 flex items-center gap-3 text-gray-900 font-medium">
              <Check className="w-5 h-5 text-indigo-600" />
              <span>Upfront & Clear</span>
            </div>
            {/* Row 4 */}
            <div className="flex-1 p-6 border-b border-indigo-100 flex items-center gap-3 text-gray-900 font-medium">
              <Check className="w-5 h-5 text-indigo-600" />
              <span>Earn Crypto for Helping</span>
            </div>
            {/* Row 5 */}
            <div className="flex-1 p-6 flex items-center gap-3 text-gray-900 font-medium">
              <X className="w-5 h-5 text-indigo-400" />
              <span>Zero (Gateway Protocol)</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}