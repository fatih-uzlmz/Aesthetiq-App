import { motion } from 'framer-motion';
import { Target, Crown, Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-40 px-6 relative bg-transparent overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tighter">
            An Investment in <span className="font-semibold text-white">Yourself.</span>
          </h2>
          <p className="text-lg text-white/50 font-light max-w-2xl mx-auto tracking-wide">
            You spend more on coffee in a week than it costs to buy back your focus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Weekly Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-[2rem] p-12 flex flex-col items-center text-center border-white/5 hover:border-white/10 transition-all duration-700 group"
          >
            <Target className="w-8 h-8 text-white/40 mb-8 group-hover:text-white transition-colors" strokeWidth={1.5} />
            <h3 className="text-2xl font-light text-white mb-2">Weekly Plan</h3>
            <p className="text-white/40 text-sm mb-10 font-light">For those ready to test their limits.</p>
            
            <div className="mb-12 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-semibold text-white tracking-tight">$4.99</span>
              <span className="text-white/40 text-sm font-light">/week</span>
            </div>
            
            <ul className="text-left w-full space-y-6 mb-12">
              {["Full App Access", "Deep Focus Timer", "Standard Challenges"].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-white/70 text-sm tracking-wide">
                  <Check className="w-5 h-5 text-white/50" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-5 rounded-2xl border border-white/20 font-semibold text-sm text-white hover:bg-white hover:text-black transition-all duration-300 mt-auto">
              Start Weekly Trial
            </button>
          </motion.div>

          {/* Yearly Tier (Best Value) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card rounded-[2rem] p-12 flex flex-col items-center text-center border-white/20 relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-4 py-2 uppercase tracking-widest rounded-bl-xl rounded-tr-[2rem]">
              Best Value
            </div>
            
            <Crown className="w-8 h-8 text-white mb-8" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold text-white mb-2">Yearly Premium</h3>
            <p className="text-white/70 text-sm mb-10 font-light">For those ready to forge a new identity.</p>
            
            <div className="mb-12 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-white tracking-tight">$79.99</span>
              <span className="text-white/60 text-sm font-light">/year</span>
            </div>
            
            <ul className="text-left w-full space-y-6 mb-12">
               {["Unlimited Group Challenges", "Premium Heat Maps", "Elite Private Networks", "Priority Support"].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-white/90 text-sm tracking-wide">
                  <Check className="w-5 h-5 text-white" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-5 rounded-2xl bg-white font-bold text-sm text-black hover:bg-gray-200 transition-all duration-300 mt-auto">
              Secure Yearly Access
            </button>
            <p className="text-white/40 text-[11px] mt-6 tracking-wide">Ends up being just ~$1.53 / week</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
