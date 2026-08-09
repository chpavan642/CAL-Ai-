import { ScanLine, ChartBar, Star, Users, Lightbulb, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Features() {
  const { t } = useLanguage();

  const features = [
    { icon: ScanLine, title: t.features.f1Title, desc: t.features.f1Desc },
    { icon: ChartBar, title: t.features.f2Title, desc: t.features.f2Desc },
    { icon: Star, title: t.features.f3Title, desc: t.features.f3Desc },
    { icon: Users, title: t.features.f4Title, desc: t.features.f4Desc },
    { icon: Lightbulb, title: t.features.f5Title, desc: t.features.f5Desc },
    { icon: Languages, title: t.features.f6Title, desc: t.features.f6Desc },
  ];

  return (
    <section id="features" className="py-20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t.features.title}</h2>
          <p className="text-gray-600">{t.features.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
