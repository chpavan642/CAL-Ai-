import { Sparkles, Camera, ArrowRight, Zap, Star, Brain } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero({ onAnalyze }: { onAnalyze: () => void }) {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 animate-[fadeIn_0.6s_ease]">
            <Sparkles className="w-3.5 h-3.5" />
            {t.hero.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">
            {t.hero.title}
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onAnalyze}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base font-semibold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
            >
              <Camera className="w-5 h-5" />
              {t.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-gray-700 text-base font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              {t.hero.secondaryCta}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            <Stat icon={<Zap className="w-5 h-5" />} value={t.hero.stat1} label={t.hero.stat1Label} />
            <Stat icon={<Star className="w-5 h-5" />} value={t.hero.stat2} label={t.hero.stat2Label} />
            <Stat icon={<Brain className="w-5 h-5" />} value={t.hero.stat3} label={t.hero.stat3Label} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
        {icon}
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
