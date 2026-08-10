export interface DishIdentification {
  name: string;
  main_visible_ingredients: string[];
}

export interface NutritionalBreakdown {
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  notable_micronutrients: string[];
}

export interface HealthRating {
  score: number;
  reason: string;
}

export interface Suitability {
  overweight_obese: string;
  underweight: string;
  diabetes: string;
  hypertension_heart_disease: string;
  athletes_active: string;
}

export interface AlternativeFoodSuggestions {
  vegetarian: string[];
  non_vegetarian: string[];
}

export interface WebhookOutput {
  dish_identification: DishIdentification;
  nutritional_breakdown: NutritionalBreakdown;
  health_rating: HealthRating;
  suitability: Suitability;
  alternative_food_suggestions: AlternativeFoodSuggestions;
}

export interface WebhookResponseItem {
  output: WebhookOutput;
}

export type WebhookResponse = WebhookResponseItem[];
