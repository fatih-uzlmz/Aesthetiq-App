import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-10 max-w-2xl mt-10 lg:mt-0"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 w-fit backdrop-blur-md bg-white/[0.02]">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Aesthetiq App</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-sans tracking-tighter leading-[1.05] text-white">
             Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Focus</span> <br/>
             is Your Power.
          </h1>
          
          <p className="text-lg text-white/50 leading-relaxed font-light max-w-lg">
            Aesthetiq is the premium habit tracker that leverages social accountability to build unbreakable discipline. Snap proof of your deep work, trace your consistency on a beautiful heatmap, and take back control of your time.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-gray-200 transition-colors text-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Free Trial
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-white/5 border border-white/10 transition-colors text-center text-white/70"
            >
              How It Works
            </motion.button>
          </div>
        </motion.div>

        {/* Right Visuals - App Replicas */}
        <div className="relative h-[650px] hidden lg:block perspective-1000 mt-10">
          
          {/* Card 1: Profile & Heatmap Fragment */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20, rotateY: -10 }}
            animate={{ opacity: 1, x: 60, y: 0, rotateY: -15, rotateX: 5 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="absolute top-0 right-0 w-[340px] bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-white/10 z-10 shadow-2xl overflow-hidden scale-95"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-sm">@alexm</span>
              <div className="flex gap-4">
                 <div className="w-5 h-5 opacity-40">
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 </div>
                 <div className="w-5 h-5 opacity-40">
                   <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-transparent p-1 bg-gradient-to-tr from-[#22c55e] to-white relative">
                 <div className="w-full h-full rounded-full overflow-hidden bg-black border-[3px] border-black">
                   <img src="https://images.unsplash.com/photo-1544367567-0f2fcb046eeb?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover opacity-80" />
                 </div>
              </div>
              <h3 className="text-white text-xl font-bold mt-4 flex items-center gap-2">
                Alex M.
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/70 uppercase">LVL 19</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 text-center mb-6 border-b border-white/5 pb-6">
              <div>
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-white/40">Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">47</div>
                <div className="text-xs text-white/40">Posts</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">19</div>
                <div className="text-xs text-white/40">Level</div>
              </div>
            </div>

            {/* Heatmap Section */}
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Activity Heatmap</h4>
              <p className="text-white/40 text-[11px] mb-4">Last 30 Days</p>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between text-[10px] text-white/30 font-mono mb-2 px-1">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[...Array(21)].map((_, i) => (
                    <div key={i} className={`w-full aspect-square rounded-[3px] ${[4,7,8,12,18,19,20].includes(i) ? 'bg-[#22c55e]' : 'bg-white/5'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Home Daily Goal Fragment */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 150, rotateY: 5 }}
            animate={{ opacity: 1, x: -60, y: 200, rotateY: -5, rotateX: 10 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="absolute left-0 w-[360px] bg-[#000] rounded-[2rem] p-5 border border-white/10 z-20 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1 pt-2 px-2">
              Thursday, March 19
            </div>
            <h2 className="text-white text-2xl font-light mb-6 px-2">
              Good Afternoon,<br/>
              <span className="font-bold">Alex</span>
            </h2>

            <div className="flex justify-between items-end mb-4 px-2">
               <h3 className="text-white font-bold text-lg">Daily Focus</h3>
               <span className="text-white/40 text-xs font-mono">1/4</span>
            </div>

            <div className="relative w-full h-44 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 flex flex-col justify-end p-5">
              <div className="absolute inset-0 grayscale opacity-40 mix-blend-screen bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
              
              <div className="relative z-10">
                <span className="bg-[#22c55e] text-black text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm mb-3 inline-block">
                  Daily Goal
                </span>
                <h4 className="text-white font-bold text-xl leading-tight mb-1">
                  Phone-Free<br/>Morning
                </h4>
                <p className="text-white/60 text-xs font-medium">150 XP</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
