import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  Star,
  Leaf,
  Fish,
  RotateCcw,
  Check,
  X,
  Salad,
  HeartPulse,
  Activity,
  Scale,
  PersonStanding,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { WebhookOutput } from "@/types";

interface ResultsProps {
  result: WebhookOutput;
  imageSrc: string;
  onNewAnalysis: () => void;
}

export function Results({ result, imageSrc, onNewAnalysis }: ResultsProps) {
  const { t } = useLanguage();

  const dish = result.dish_identification;
  const nutrition = result.nutritional_breakdown;
  const health = result.health_rating;
  const suitability = result.suitability;
  const alternatives = result.alternative_food_suggestions;

  const rating = Number(health?.score) || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const totalFilled = hasHalf ? fullStars + 0.5 : Math.round(rating);

  const suitabilityGroups = [
    { key: "overweight_obese", label: t.results.groupOverweight, icon: Scale },
    { key: "underweight", label: t.results.groupUnderweight, icon: PersonStanding },
    { key: "diabetes", label: t.results.groupDiabetes, icon: Activity },
    { key: "hypertension_heart_disease", label: t.results.groupHypertension, icon: HeartPulse },
    { key: "athletes_active", label: t.results.groupAthletes, icon: Salad },
  ] as const;

  return (
    <section id="analyzer" className="py-20 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t.results.title}</h2>
        </div>

        {/* Image + Dish name */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden mb-6">
          <div className="relative">
            <img src={imageSrc} alt={dish?.name} className="w-full max-h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                {t.results.dishName}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{dish?.name}</h3>
            </div>
          </div>
          {dish?.main_visible_ingredients?.length > 0 && (
            <div className="p-6">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                {t.results.ingredients}
              </p>
              <div className="flex flex-wrap gap-2">
                {dish.main_visible_ingredients.map((ingredient, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-800"
                  >
                    <Salad className="w-3.5 h-3.5 text-emerald-500" />
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nutrition Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <NutritionCard
            icon={<Flame className="w-5 h-5" />}
            label={t.results.calories}
            value={nutrition?.calories_kcal != null ? `${nutrition.calories_kcal}` : "—"}
            unit="kcal"
            color="orange"
          />
          <NutritionCard
            icon={<Beef className="w-5 h-5" />}
            label={t.results.protein}
            value={nutrition?.protein_g != null ? `${nutrition.protein_g}g` : "—"}
            color="rose"
          />
          <NutritionCard
            icon={<Wheat className="w-5 h-5" />}
            label={t.results.carbs}
            value={nutrition?.carbohydrates_g != null ? `${nutrition.carbohydrates_g}g` : "—"}
            color="amber"
          />
          <NutritionCard
            icon={<Droplet className="w-5 h-5" />}
            label={t.results.fats}
            value={nutrition?.fat_g != null ? `${nutrition.fat_g}g` : "—"}
            color="sky"
          />
        </div>

        {/* Micronutrients */}
        {nutrition?.notable_micronutrients?.length > 0 && (
          <Card title={t.results.micronutrients}>
            <div className="flex flex-wrap gap-2">
              {nutrition.notable_micronutrients.map((m, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100"
                >
                  <span className="text-sm font-semibold text-emerald-800">{m}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Health Rating */}
        <Card title={t.results.healthRating}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => {
                const filled = i < totalFilled;
                const half = hasHalf && i === fullStars;
                return (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      filled || half
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {rating.toFixed(0)}
              <span className="text-lg text-gray-400">/5</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-amber-800">{t.results.healthReason} </span>
              {health?.reason}
            </p>
          </div>
        </Card>

        {/* Suitability */}
        <Card title={t.results.suitability}>
          <div className="space-y-3">
            {suitabilityGroups.map((group) => {
              const text = (suitability as unknown as Record<string, string>)?.[group.key];
              if (!text) return null;
              const preferable = text.toLowerCase().startsWith("preferable");
              return (
                <div
                  key={group.key}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                      preferable
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {preferable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <group.icon className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Alternatives */}
        <Card title={t.results.alternatives}>
          <div className="space-y-4">
            {alternatives?.vegetarian?.length > 0 && (
              <AlternativeSection
                icon={<Leaf className="w-4 h-4" />}
                label={t.results.vegetarian}
                items={alternatives.vegetarian}
                color="green"
              />
            )}
            {alternatives?.non_vegetarian?.length > 0 && (
              <AlternativeSection
                icon={<Fish className="w-4 h-4" />}
                label={t.results.nonVegetarian}
                items={alternatives.non_vegetarian}
                color="orange"
              />
            )}
          </div>
        </Card>

        {/* New Analysis Button */}
        <div className="text-center mt-8">
          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-emerald-300 hover:text-emerald-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t.analyzer.newAnalysis}
          </button>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-6">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">{title}</h3>
      {children}
    </div>
  );
}

function NutritionCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color: "orange" | "rose" | "amber" | "sky";
}) {
  const colors = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4 text-center">
      <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3 border ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      {unit && <p className="text-[10px] text-gray-400">{unit}</p>}
    </div>
  );
}

function AlternativeSection({
  icon,
  label,
  items,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  color: "green" | "orange";
}) {
  const colors = {
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-gray-900">{label}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
          >
            <p className="text-xs text-gray-500 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
