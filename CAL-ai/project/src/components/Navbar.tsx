import { useEffect, useState } from "react";
import { Camera, Sparkles, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar({ onAnalyze }: { onAnalyze: () => void }) {
  const { t, lang, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              CAL<span className="text-emerald-600">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("features")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={onAnalyze}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {t.nav.analyze}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm text-xs font-semibold text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-all"
            >
              <span className={lang === "en" ? "text-emerald-600" : "text-gray-400"}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={lang === "te" ? "text-emerald-600" : "text-gray-400"}>తె</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <button
              onClick={() => scrollTo("features")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => {
                onAnalyze();
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              {t.nav.analyze}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
