import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass border-b-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
          <span className="text-sm font-bold tracking-[0.2em] uppercase">AESTHETIQ</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase font-medium text-white/40">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#proof" className="hover:text-white transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all"
        >
          Start Your Journey
        </motion.button>
      </div>
    </nav>
  );
}
