import { Camera, BrainCircuit, ClipboardCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { icon: Camera, title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
    { icon: BrainCircuit, title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
    { icon: ClipboardCheck, title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
  ];

  return (
    <section id="how-it-works" className="py-20 scroll-mt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t.howItWorks.title}</h2>
          <p className="text-gray-600">{t.howItWorks.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[60%] w-full h-px border-t-2 border-dashed border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
