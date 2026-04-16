import { motion } from 'framer-motion';
import { ClipboardList, Home, Trophy, UserCircle } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: "The Assessment.",
      description: "Take the onboarding quiz. We build a highly curated plan based on your symptoms and goals before you hit the paywall.",
      icon: <ClipboardList className="w-5 h-5 text-white/80" strokeWidth={1.5} />,
      colSpan: "md:col-span-2",
      image: "bg-[radial-gradient(ellipse_at_top_right,_#111_0%,_transparent_60%)]" 
    },
    {
      title: "Your Homebase.",
      description: "Knock out your Daily Focus, view Trending Challenges, and see your friends' posts in real-time.",
      icon: <Home className="w-5 h-5 text-blue-400/80" strokeWidth={1.5} />,
      colSpan: "md:col-span-1",
      image: "bg-[radial-gradient(circle_at_top_left,_#1a1a1a_0%,_transparent_60%)]"
    },
    {
      title: "Challenges Hub.",
      description: "Push your limits today. Tackle your mandatory daily and weekly tasks and earn XP.",
      icon: <Trophy className="w-5 h-5 text-orange-400/80" strokeWidth={1.5} />,
      colSpan: "md:col-span-1",
      image: "bg-[radial-gradient(circle_at_bottom_right,_#111_0%,_transparent_50%)]"
    },
    {
      title: "Social Identity.",
      description: "Your fully public profile. Track your streak, level, and visualize your consistency on the Activity Heatmap.",
      icon: <UserCircle className="w-5 h-5 text-aesthetiq-green" strokeWidth={1.5} />,
      colSpan: "md:col-span-2",
      image: "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyMmM1NWUzMyJzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] bg-[size:24px_24px] opacity-80"
    }
  ];

  return (
    <section id="features" className="py-40 px-6 bg-transparent relative overflow-hidden text-center md:text-left border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 md:flex items-end justify-between border-b border-white/10 pb-10">
            <div>
              <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-4">Core Features</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter">
                How It <span className="font-semibold text-white">Works.</span>
              </h2>
            </div>
            <p className="text-sm text-white/50 font-light max-w-md mt-6 md:mt-0 leading-relaxed tracking-wide">
              The tools engineered to forge unparalleled discipline and keep you focused on what matters most.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[380px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className={`glass rounded-3xl p-10 relative overflow-hidden flex flex-col justify-between ${feature.colSpan} ${feature.image} border border-white/5 hover:border-white/15 transition-all duration-500 group`}
            >
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-full border border-white/10 bg-black/40 flex items-center justify-center mb-auto shadow-lg group-hover:scale-110 group-hover:bg-black/80 transition-all duration-700`}>
                  {feature.icon}
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-light text-white mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-white/50 font-light text-sm leading-relaxed tracking-wide group-hover:text-white/70 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
