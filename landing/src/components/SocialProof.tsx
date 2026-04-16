import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function SocialProof() {
  return (
    <section id="proof" className="py-40 px-6 relative border-t border-white/5 bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tighter text-white">
            <span className="font-semibold text-white">Empowered</span> Users.
          </h2>
          <p className="text-sm text-white/50 font-light tracking-[0.2em] uppercase">Join thousands of high achievers.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-4xl w-full"
        >
          {/* Main featured review */}
          <div className="glass p-12 md:p-20 rounded-3xl relative overflow-hidden border border-white/10 hover:border-white/20 transition-colors duration-700 shadow-2xl">
            <div className="absolute top-10 right-10 opacity-10 text-white">
              <Quote className="w-24 h-24" strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              
              <blockquote className="text-3xl md:text-4xl leading-[1.4] font-light text-white mb-12 tracking-tight">
                "I don't usually stick to apps like this... but something about this one <span className="font-medium text-white italic">hit different</span>."
              </blockquote>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-aesthetiq-green to-blue-500">
                  <div className="w-full h-full bg-black rounded-full overflow-hidden relative">
                    <img src="https://i.pravatar.cc/150?u=aesthetiq_user_1" alt="Reviewer" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium text-sm tracking-widest uppercase mt-2">Alex M.</div>
                  <div className="text-white/40 text-[10px] tracking-[0.3em] mt-1">Student & Creator</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
