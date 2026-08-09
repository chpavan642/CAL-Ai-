import { Camera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900">
              CAL<span className="text-emerald-600">AI</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">{t.footer.tagline}</p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CAL AI. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
