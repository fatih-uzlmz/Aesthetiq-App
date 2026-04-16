import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TheProblem from './components/TheProblem';
import FeaturesGrid from './components/FeaturesGrid';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-black min-h-screen text-white antialiased overflow-x-hidden relative selection:bg-white/20">
      {/* Breathing background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#2a2a2a] via-[#050505] to-[#000000] bg-[length:200%_200%] animate-breathe opacity-90" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <TheProblem />
          <FeaturesGrid />
          <SocialProof />
          <Pricing />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
