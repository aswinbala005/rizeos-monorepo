import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center overflow-hidden relative bg-white">
      
      {/* Tech Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="text-left space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now accepting Early Access users
          </div>

              
          <h1 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter leading-[1.1]`}>
            Secure your dream <br />
            tech jobs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Effortlessly
            </span>
          </h1>      
 

          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            Say goodbye to irrelevant offers and ghosting. Create a verified profile, and top companies reach out with relevant opportunities based on your <strong>Proof of Skill</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth?role=seeker">
              <Button className="h-14 px-8 rounded-full bg-gray-900 hover:bg-black text-white text-lg font-medium shadow-xl shadow-indigo-200/50 transition-all">
                Start Your Profile
              </Button>
            </Link>
            <Link href="/auth?role=recruiter">
              <Button variant="outline" className="h-14 px-8 rounded-full border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white text-lg font-medium">
                I'm Hiring Talent
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Visual (Glassmorphism Card) */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] transform rotate-6 scale-95 opacity-10 blur-2xl -z-10" />
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative z-10">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-auto text-xs font-medium text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> AI Verified
              </div>
            </div>
            <div className="space-y-3 font-mono text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <div className="flex gap-4"><span className="text-gray-400">1</span><span className="text-purple-600">const</span> <span className="text-indigo-600">You</span> = {"{"}</div>
              <div className="flex gap-4"><span className="text-gray-400">2</span><span className="pl-4 text-gray-600">skills</span>: [<span className="text-green-600">"Solidity"</span>, <span className="text-green-600">"React"</span>],</div>
              <div className="flex gap-4"><span className="text-gray-400">3</span><span className="pl-4 text-gray-600">verified</span>: <span className="text-blue-600">true</span>,</div>
              <div className="flex gap-4"><span className="text-gray-400">4</span><span className="pl-4 text-gray-600">offers</span>: <span className="text-orange-500">5</span></div>
              <div className="flex gap-4"><span className="text-gray-400">5</span>{"}"};</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 w-64 animate-in slide-in-from-bottom-4 fade-in duration-1000">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center"><Briefcase className="w-5 h-5 text-indigo-600" /></div>
                <div><p className="text-sm font-bold text-gray-900">Interview Request</p><p className="text-xs text-gray-500">Senior Frontend @ Nexus</p></div>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[98%]" /></div>
              <p className="text-[10px] text-right text-indigo-600 font-bold mt-1">98% Match</p>
            </div>
            <div className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 w-60 animate-in slide-in-from-right-4 fade-in duration-1000 delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-purple-600" /></div>
                <div><p className="text-sm font-bold text-gray-900">@Alex_Dev</p><p className="text-xs text-gray-500">"Sent you 50 MATIC!"</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}