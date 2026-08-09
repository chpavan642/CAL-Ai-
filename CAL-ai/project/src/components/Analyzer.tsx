import { useRef, useState, useCallback } from "react";
import {
  Upload,
  Camera,
  Loader2,
  ImageIcon,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { WebhookOutput } from "@/types";

interface AnalyzerProps {
  onResult: (result: WebhookOutput, imageSrc: string) => void;
}

type Status = "idle" | "preview" | "analyzing" | "error";

export function Analyzer({ onResult }: AnalyzerProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageSrc(result);
      setImageData(result);
      setStatus("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    setStatus("analyzing");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-meal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ image: imageData }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      onResult(data as WebhookOutput, imageSrc!);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setImageSrc(null);
    setImageData(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <section id="analyzer" className="py-20 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t.analyzer.title}</h2>
          <p className="text-gray-600">{t.analyzer.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          {status === "analyzing" ? (
            <AnalyzingState hint={t.analyzer.analyzingHint} label={t.analyzer.analyzing} imageSrc={imageSrc} />
          ) : status === "error" ? (
            <ErrorState
              message={t.analyzer.error}
              tryAgainLabel={t.analyzer.tryAgain}
              onRetry={() => setStatus("preview")}
              onReset={reset}
            />
          ) : imageSrc ? (
            <PreviewState
              imageSrc={imageSrc}
              label={t.analyzer.analyze}
              retakeLabel={t.analyzer.retake}
              onAnalyze={handleAnalyze}
              onRetake={reset}
            />
          ) : (
            <UploadState
              uploadTitle={t.analyzer.uploadTitle}
              uploadHint={t.analyzer.uploadHint}
              captureLabel={t.analyzer.capture}
              dragOver={dragOver}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onUploadClick={() => fileInputRef.current?.click()}
              onCaptureClick={() => cameraInputRef.current?.click()}
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
}

function UploadState({
  uploadTitle,
  uploadHint,
  captureLabel,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
  onCaptureClick,
}: {
  uploadTitle: string;
  uploadHint: string;
  captureLabel: string;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onUploadClick: () => void;
  onCaptureClick: () => void;
}) {
  return (
    <div className="p-6 sm:p-10">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onUploadClick}
        className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-emerald-400 bg-emerald-50/50 scale-[1.02]"
            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
          <Upload className="w-7 h-7 text-white" />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-1">{uploadTitle}</p>
        <p className="text-sm text-gray-500">{uploadHint}</p>
      </div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <button
        onClick={onCaptureClick}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all"
      >
        <Camera className="w-5 h-5" />
        {captureLabel}
      </button>
    </div>
  );
}

function PreviewState({
  imageSrc,
  label,
  retakeLabel,
  onAnalyze,
  onRetake,
}: {
  imageSrc: string;
  label: string;
  retakeLabel: string;
  onAnalyze: () => void;
  onRetake: () => void;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="relative rounded-2xl overflow-hidden mb-5">
        <img src={imageSrc} alt="Meal preview" className="w-full max-h-80 object-cover" />
        <button
          onClick={onRetake}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAnalyze}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {label}
        </button>
        <button
          onClick={onRetake}
          className="sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all"
        >
          <ImageIcon className="w-4 h-4" />
          {retakeLabel}
        </button>
      </div>
    </div>
  );
}

function AnalyzingState({
  hint,
  label,
  imageSrc,
}: {
  hint: string;
  label: string;
  imageSrc: string | null;
}) {
  return (
    <div className="p-6 sm:p-10">
      {imageSrc && (
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img src={imageSrc} alt="Analyzing" className="w-full max-h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
        </div>
      )}
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-emerald-400/20 blur-md -z-10 animate-pulse" />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-500">{hint}</p>
        <div className="flex gap-1.5 mt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  tryAgainLabel,
  onRetry,
  onReset,
}: {
  message: string;
  tryAgainLabel: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-base font-semibold text-gray-900 mb-1">{message}</p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:scale-105 transition-all"
          >
            {tryAgainLabel}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
