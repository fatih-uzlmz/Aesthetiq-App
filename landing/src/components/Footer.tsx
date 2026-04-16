import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-transparent pt-32 pb-16 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-8">
            Ready to <span className="font-semibold text-white">Reset?</span>
          </h2>
          <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-gray-200 transition-colors inline-flex items-center justify-center min-w-[200px]">
            Download Aesthetiq
          </button>
        </div>

        <div className="w-full border-t border-white/5 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/40" strokeWidth={1.5} />
            <span className="text-white/40 font-bold tracking-widest uppercase text-xs">AESTHETIQ</span>
          </div>

          <div className="flex gap-8 text-xs tracking-widest uppercase text-white/40">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        
        <p className="text-white/20 text-[10px] tracking-widest uppercase mt-12 text-center">
          © {new Date().getFullYear()} Aesthetiq Inc. Forge discipline.
        </p>
      </div>
    </footer>
  );
}
