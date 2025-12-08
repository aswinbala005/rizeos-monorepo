import { Bot, Search, ShieldCheck, Users } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-50">
      
      {/* Tech Grid Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Two Engines. <span className="text-indigo-600">Infinite Potential.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We separated the noise from the signal. A powerful Job Engine and a vibrant Community Engine working in sync.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- CARD 1: THE JOB ENGINE (Indigo Gradient) --- */}
          <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-indigo-900/50">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Transparency First</h3>
              <p className="text-indigo-200/80 mb-8 max-w-sm leading-relaxed">
                See salary, equity, and tech stack upfront. Our AI verifies skills so you don't have to guess.
              </p>
              
              {/* UI Mockup: Job Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    Go
                  </div>
                  <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full font-medium border border-green-500/30">
                    98% Match
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg">Senior Backend Engineer</h4>
                <div className="flex gap-2 mt-4">
                    <span className="text-[10px] bg-black/30 text-indigo-200 px-2 py-1 rounded border border-indigo-500/20">£80k - £120k</span>
                    <span className="text-[10px] bg-black/30 text-indigo-200 px-2 py-1 rounded border border-indigo-500/20">Remote</span>
                </div>
              </div>
            </div>
          </div>


          {/* --- CARD 2: THE NETWORKING ENGINE (Purple Gradient) --- */}
          <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-purple-900/50">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Community Support</h3>
              <p className="text-purple-200/80 mb-8 max-w-sm leading-relaxed">
                Stuck on a bug? Light a Beacon. Experts help you in real-time and earn crypto tips.
              </p>

              {/* UI Mockup: Chat Interface */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-bold">
                    JD
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-sm text-gray-200 border border-white/5">
                    <p>Help! Next.js hydration error 😭</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-purple-600 rounded-2xl rounded-tr-none p-3 text-sm text-white shadow-lg">
                    <p>Check your `useEffect`. Here's a fix...</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] bg-black/20 px-2 py-1 rounded flex items-center gap-1">
                            ⚡ Tipped 5 MATIC
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* --- CARD 3: AI MATCHING (Teal Gradient) --- */}
          <div className="bg-gradient-to-br from-white to-teal-50 rounded-[2.5rem] p-10 border border-teal-100 shadow-xl shadow-teal-100/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                    <Search className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Matching</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Our AI connects the dots between your skills and the job requirements.
                </p>
                
                {/* UI Mockup: Animated Skill Nodes */}
                <div className="flex justify-center items-center gap-2 py-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-teal-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="px-3 py-1.5 rounded-full bg-white border border-teal-200 text-teal-700 text-xs font-medium shadow-sm">Python</div>
                    <div className="w-8 h-0.5 bg-teal-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-teal-500 w-1/2 animate-[shimmer_1.5s_infinite] translate-x-[-100%]" />
                    </div>
                    <div className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-200 z-10">
                        Data Scientist
                    </div>
                    <div className="w-8 h-0.5 bg-teal-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-teal-500 w-1/2 animate-[shimmer_1.5s_infinite_0.5s] translate-x-[-100%]" />
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white border border-teal-200 text-teal-700 text-xs font-medium shadow-sm">SQL</div>
                </div>
             </div>
          </div>

          {/* --- CARD 4: AI AGENTS (Orange Gradient) --- */}
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-[2.5rem] p-10 border border-orange-100 shadow-xl shadow-orange-100/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
             <div className="relative z-10">
                {/* Header Icon (Avatars) */}
                <div className="flex -space-x-3 mb-6">
                    <img 
                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" 
                        alt="Tracer" 
                        className="w-12 h-12 rounded-full border-2 border-white bg-orange-100"
                    />
                    <img 
                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Nolan" 
                        alt="Faye" 
                        className="w-12 h-12 rounded-full border-2 border-white bg-orange-100"
                    />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Meet Your AI Team</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    <strong>Tracer</strong> hunts for talent. <strong>Faye</strong> screens applications. You just show up for the interview.
                </p>
                
                {/* UI Mockup: Agents Pipeline */}
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                    
                    {/* Tracer (Boy Avatar) */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-10 h-10 bg-white border-2 border-orange-200 rounded-full flex items-center justify-center shadow-sm mb-1 overflow-hidden">
                            <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" alt="Tracer" className="w-full h-full" />
                        </div>
                        <span className="text-[9px] font-bold text-orange-800 uppercase tracking-wider">Tracer</span>
                    </div>

                    {/* Line 1 */}
                    <div className="flex-1 h-0.5 bg-orange-200 mx-1 relative">
                         <div className="absolute -top-1 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                    </div>

                    {/* Brain */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shadow-inner mb-1">
                            🧠
                        </div>
                    </div>

                    {/* Line 2 */}
                    <div className="flex-1 h-0.5 bg-orange-200 mx-1" />

                    {/* Faye (Male Avatar - Nolan, but named Faye) */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-10 h-10 bg-white border-2 border-orange-200 rounded-full flex items-center justify-center shadow-sm mb-1 overflow-hidden">
                            <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Nolan" alt="Faye" className="w-full h-full" />
                        </div>
                        <span className="text-[9px] font-bold text-orange-800 uppercase tracking-wider">Faye</span>
                    </div>

                    {/* Line 3 */}
                    <div className="flex-1 h-0.5 bg-orange-200 mx-1" />

                    {/* Hired */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white mb-1">
                            ✅
                        </div>
                        <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Hired</span>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}