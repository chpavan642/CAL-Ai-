import { useState, useRef } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Analyzer } from "@/components/Analyzer";
import { Results } from "@/components/Results";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import type { WebhookOutput } from "@/types";

function AppContent() {
  const [result, setResult] = useState<WebhookOutput | null>(null);
  const [resultImage, setResultImage] = useState<string>("");
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = () => {
    document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResult = (res: WebhookOutput, imageSrc: string) => {
    setResult(res);
    setResultImage(imageSrc);
    setTimeout(() => {
      document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setResultImage("");
    setTimeout(scrollToAnalyzer, 100);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Navbar onAnalyze={scrollToAnalyzer} />
      <main>
        {result ? (
          <Results result={result} imageSrc={resultImage} onNewAnalysis={handleNewAnalysis} />
        ) : (
          <>
            <Hero onAnalyze={scrollToAnalyzer} />
            <Analyzer onResult={handleResult} />
            <Features />
            <HowItWorks />
          </>
        )}
      </main>
      <Footer />
      <div ref={analyzerRef} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
