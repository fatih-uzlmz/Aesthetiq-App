import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function TheProblem() {

  return (
    <section id="problem" className="py-40 px-6 relative z-10 border-t border-white/5 bg-black/50 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="flex mb-8">
            <ShieldAlert className="w-8 h-8 text-white/50" strokeWidth={1} />
          </div>
          <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-tighter text-white">
            Motivation is <span className="font-semibold text-red-500">unreliable.</span>
          </h2>
          <p className="text-lg text-white/40 font-light leading-relaxed tracking-wide">
            The ecosystem of modern applications is explicitly designed to fragment your focus.
            Stop letting the world dictate your attention. Aesthetiq gives you the tools to reclaim your time 
            and build a visible legacy of your own progress. Discipline is what keeps you going when motivation gets you started.
          </p>
        </motion.div>

        {/* Right Side: Re-created Fading Graph UI from app */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-md w-full mx-auto"
        >
          <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative bg-[#0a0a0a]/80 backdrop-blur-2xl">
            <h3 className="text-center text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
              Your discipline is <span className="text-aesthetiq-red">FADING</span>
            </h3>
            <p className="text-center text-white/40 text-[13px] leading-relaxed mb-10 px-4 font-light tracking-wide">
              You have the desire to improve, but your daily habits are actively sabotaging your momentum.
            </p>

            {/* The Graph Re-creation */}
            <div className="relative h-48 w-full border-l border-b border-white/20 mb-10 flex ml-4 px-2">
              <div className="absolute -left-8 top-1/2 -rotate-90 text-[10px] text-white/30 uppercase tracking-[0.2em] transform -translate-y-1/2">
                Performance
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-white/30 uppercase tracking-[0.2em]">
                Time
              </div>

              {/* The SVG Line */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#22c55e" />
                    <stop offset="60%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0 60 Q 30 10, 50 30 T 100 90" 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3"
                  className="path-animate"
                  strokeLinecap="round"
                />
                
                {/* Motivation Peak Dot */}
                <circle cx="30" cy="30" r="3" fill="#22c55e" />
                {/* Burnout End Dot */}
                <circle cx="95" cy="85" r="3" fill="#ef4444" />
              </svg>

              {/* Labels */}
              <div className="absolute top-4 left-6 text-white font-medium text-xs">
                Initial Motivation
              </div>
              <div className="absolute bottom-10 right-0 text-white font-medium text-xs text-right leading-tight">
                Friction &<br/>Burnout
              </div>
            </div>

            {/* Bottom Card box */}
            <div className="bg-white/5 rounded-xl p-5 mb-8 border border-white/5">
              <p className="text-center text-white/50 text-xs leading-relaxed font-light tracking-wide">
                Motivation gets you started, but it's unreliable. Discipline is what keeps you going when it gets hard.
              </p>
            </div>

            <button className="w-full bg-white text-black font-bold text-sm tracking-wider uppercase py-4 rounded-full hover:bg-gray-200 transition-colors">
              Let's Go
            </button>
          </div>
          
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-aesthetiq-red/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
