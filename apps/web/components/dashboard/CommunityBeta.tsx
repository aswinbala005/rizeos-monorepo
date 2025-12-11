"use client";

import { Space_Grotesk } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Zap, Users, Radio, Layout, Activity, Trophy, Video, Code2, 
  CheckCircle2, Sparkles, MessageSquare, MoreHorizontal, 
  Briefcase, ArrowRight, ShieldCheck 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Animation variants (Typed as any to bypass strict transition type checks)
const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scrollReveal: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export function CommunityBeta() {
  return (
    <div className="min-h-screen bg-white text-gray-900 rounded-3xl overflow-hidden border border-gray-200 relative font-sans">
      
      {/* --- GLOBAL BACKGROUND EFFECTS (Light Mode) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-50/80 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-50/80 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* --- HERO SECTION --- */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center space-y-8 mb-40"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span> Beta version: Community Hub</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className={`${spaceGrotesk.className} text-7xl md:text-9xl font-bold tracking-tighter text-gray-900`} >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Hacker House
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The first professional network where you <strong>build, debug, and earn</strong> together. 
            Turn your side projects into a career and your helpfulness into crypto.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Button className="h-14 px-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold shadow-xl shadow-indigo-200">
              Join the Waitlist
            </Button>
          </motion.div>
        </motion.div>


        {/* --- PHASE 1: THE COMMAND CENTER --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollReveal}
          className="mb-40"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-900">
              <Layout className="w-10 h-10 text-indigo-600" />
              The Command Center
            </h2>
            <p className="text-lg text-gray-500">A high-density workspace designed for builders, not scrollers.</p>
          </div>

          {/* UI Mockup */}
          <div className="grid grid-cols-12 gap-6 h-[600px] border border-gray-200 rounded-3xl p-6 bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 overflow-hidden">
            
            {/* Left Sidebar */}
            <div className="col-span-3 flex flex-col gap-6 border-r border-gray-100 pr-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
                        <Activity className="w-4 h-4" /> Activity Feed
                    </div>
                    <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors">
                        <Radio className="w-4 h-4" /> SOS Beacons <Badge className="ml-auto bg-red-100 text-red-600 border-0">3</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors">
                        <Trophy className="w-4 h-4" /> Bounties
                    </div>
                </div>

                <div className="mt-auto">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">My Squad</p>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="w-8 h-8"><AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${i}`} /></Avatar>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Builder_{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Stage */}
            <div className="col-span-6 flex flex-col gap-6 overflow-hidden relative">
                {/* Post 1 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            <Avatar><AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Alex" /></Avatar>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Alex Chen</p>
                                <p className="text-xs text-gray-500">Frontend Wizard • 2h ago</p>
                            </div>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                        Finally fixed that hydration error in Next.js 14! The trick was using `suppressHydrationWarning` on the timestamp component. 🚀
                    </p>
                    <div className="bg-gray-900 rounded-lg p-3 mb-4 overflow-hidden">
                        <code className="text-xs font-mono text-green-400">
                            &lt;span suppressHydrationWarning&gt;<br/>
                            &nbsp;&nbsp;{`{new Date().toLocaleTimeString()}`}<br/>
                            &lt;/span&gt;
                        </code>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex gap-4 text-gray-400 text-xs font-medium">
                            <span className="flex items-center gap-1 hover:text-indigo-600"><MessageSquare className="w-3 h-3" /> 12</span>
                            <span className="flex items-center gap-1 hover:text-indigo-600"><Zap className="w-3 h-3" /> 45</span>
                        </div>
                        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100">
                            ⚡ Tip 0.1 MATIC
                        </Badge>
                    </div>
                </div>

                {/* Post 2 (Cut off) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm opacity-50">
                    <div className="flex gap-3">
                        <Avatar><AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Sarah" /></Avatar>
                        <div className="w-full">
                            <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
                            <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                            <div className="h-3 w-2/3 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 border-l border-gray-100 pl-6 flex flex-col gap-6">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Rooms</p>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-xs font-bold text-red-700">Debug: Smart Contract</span>
                            </div>
                            <span className="text-[10px] text-red-500 bg-white px-1.5 py-0.5 rounded-md border border-red-100">3 watching</span>
                        </div>
                        <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-300 rounded-full" />
                                <span className="text-xs font-medium text-gray-600">Design Review</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trending Topics</p>
                    <div className="flex flex-wrap gap-2">
                        {["#Solidity", "#NextJS", "#Rust", "#DeFi"].map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

          </div>
        </motion.section>


        {/* --- PHASE 2: THE FEED (STORIES) --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="mb-32 grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Proof-of-Work Stories</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              No more "I'm humbled to announce". Share <strong>Work-in-Progress</strong>. 
              Users with active stories have a pulsing ring. Click to view ephemeral code snippets or demos.
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> 24-hour ephemeral content</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Code-focused updates</li>
            </ul>
          </div>

          {/* UI Mockup: Stories */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 flex justify-center gap-6 shadow-xl shadow-purple-100/50">
             {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div className={`relative w-20 h-20 rounded-full p-[3px] ${i === 2 ? 'bg-gray-200' : 'bg-gradient-to-tr from-purple-500 to-indigo-500'}`}>
                        <div className="w-full h-full bg-white rounded-full border-4 border-white overflow-hidden">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${i}`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </div>
                        {i !== 2 && <div className="absolute inset-0 rounded-full border-2 border-transparent animate-pulse" />}
                    </div>
                    <span className="text-xs text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">@Builder{i}</span>
                </div>
             ))}
          </div>
        </motion.section>


        {/* --- PHASE 3: THE BRIDGE --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="mb-40"
        >
           <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Networking is the New Resume</h2>
            <p className="text-lg text-gray-500">How GrindLink connects Seekers and Recruiters through actual work.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Feature 1: Bounty to Hire */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl border border-orange-100 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Briefcase className="w-32 h-32 text-orange-500" />
                </div>
                <div className="relative z-10">
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">For Seekers</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bounty-to-Hire</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        Companies post "Sponsored Beacons" (small bugs). You fix them. If they like your code, you get an interview instantly.
                    </p>
                    
                    <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                        <div className="flex-1 text-center">
                            <div className="text-xs text-gray-400 uppercase font-bold">Task</div>
                            <div className="text-sm font-bold text-gray-900">Fix CSS Bug</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-orange-400" />
                        <div className="flex-1 text-center">
                            <div className="text-xs text-gray-400 uppercase font-bold">Reward</div>
                            <div className="text-sm font-bold text-green-600">$50 + Interview</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 2: Peer Vetting */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">For Recruiters</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Peer Vetting</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        Don't trust resumes? Trust the community. Candidates can pay experts to review their code and get a "Verified" stamp.
                    </p>
                    
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                        <Avatar className="h-10 w-10 border-2 border-green-500">
                            <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Dev" />
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">Jane Doe</span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-xs text-gray-500">Vetted by @SeniorDev (Top 1%)</p>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </motion.section>


        {/* --- PHASE 4: SOS BEACONS --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="mb-32"
        >
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-900">
              <Radio className="w-8 h-8 text-red-500" />
              Real-Time Help Desk
            </h2>
            <p className="text-gray-500">Stuck? Light a beacon. Solve? Get paid.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-gray-400 uppercase mb-4">Step 1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Light a Beacon</h3>
                <p className="text-sm text-gray-500 mb-6">Describe your bug. AI auto-tags it.</p>
                <div className="bg-gray-50 border border-red-100 p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2"><Radio className="w-4 h-4 text-red-500 animate-pulse" /></div>
                    <p className="text-sm font-bold text-gray-900">Next.js Hydration Error</p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-gray-400 uppercase mb-4">Step 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Debugging</h3>
                <p className="text-sm text-gray-500 mb-6">Public group chat. Spectators welcome.</p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                    <div className="h-2 w-1/2 bg-indigo-200 rounded ml-auto" />
                </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-gray-400 uppercase mb-4">Step 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Tipped</h3>
                <p className="text-sm text-gray-500 mb-6">Mark as solved. Reward the hero.</p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                    <p className="text-sm font-bold text-yellow-700">Received 5 MATIC</p>
                </div>
            </div>
          </div>
        </motion.section>


        {/* --- PHASE 5: WEB3 GRATITUDE --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="mb-32 bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-100 rounded-3xl p-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                    <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">The Gratitude Protocol</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Monetize your helpfulness. Tipping is reserved for <strong>actual problem solving</strong>. 
                    Earn crypto and mint <strong>Soulbound Tokens (SBTs)</strong> like "Grandmaster Debugger".
                </p>
                <div className="flex gap-4">
                    <Badge className="bg-white text-orange-600 border-orange-200 px-3 py-1 shadow-sm">Micro-Tipping</Badge>
                    <Badge className="bg-white text-blue-600 border-blue-200 px-3 py-1 shadow-sm">On-Chain Reputation</Badge>
                </div>
            </div>

            {/* UI Mockup: Tipping */}
            <div className="flex-1 w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 relative shadow-xl shadow-orange-100">
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    +0.1 MATIC
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=Hero" /></Avatar>
                        <div>
                            <p className="text-sm font-bold text-gray-900">@DevHero</p>
                            <p className="text-xs text-gray-500">Solved your bug</p>
                        </div>
                    </div>
                    <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold gap-2 border border-yellow-500/20">
                        <Zap className="w-4 h-4 fill-yellow-900" /> Tip
                    </Button>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-yellow-400" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">Reputation Score: 850</p>
            </div>
          </div>
        </motion.section>


        {/* --- PHASE 6: COMMUNITY PULSE --- */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="grid md:grid-cols-2 gap-8"
        >
            {/* Live Rooms */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Live Rooms</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-sm text-gray-700">Debugging Smart Contract</span>
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {i * 4}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-900">Top Contributors</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i===1 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {i}
                                </div>
                                <span className="text-sm text-gray-700">@Builder{i}</span>
                            </div>
                            <span className="text-xs font-mono text-indigo-600 font-medium">{1000 - (i * 50)} Karma</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>

      </div>
    </div>
  );
}