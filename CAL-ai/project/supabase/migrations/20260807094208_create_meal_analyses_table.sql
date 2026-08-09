/*
# Create meal_analyses table (single-tenant, no auth)

1. New Tables
- `meal_analyses`
  - `id` (uuid, primary key)
  - `image_url` (text, optional - storage path if uploaded)
  - `dish_name` (text, identified dish name)
  - `description` (text, brief description with main visible ingredients)
  - `calories` (integer, estimated kcal per serving)
  - `protein` (text, e.g. "25g")
  - `carbohydrates` (text, e.g. "40g")
  - `fats` (text, e.g. "15g")
  - `micronutrients` (jsonb, notable vitamins/minerals/fiber/sodium)
  - `health_rating` (numeric, 0-5 scale)
  - `health_reason` (text, explanation of the score)
  - `suitability` (jsonb, per-group suitability assessments)
  - `alternatives` (jsonb, vegetarian + non-vegetarian alternatives)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `meal_analyses`.
- Allow anon + authenticated CRUD (single-tenant public app, no sign-in).
*/

CREATE TABLE IF NOT EXISTS meal_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  dish_name text NOT NULL,
  description text NOT NULL,
  calories integer,
  protein text,
  carbohydrates text,
  fats text,
  micronutrients jsonb,
  health_rating numeric(2,1),
  health_reason text,
  suitability jsonb,
  alternatives jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meal_analyses" ON meal_analyses;
CREATE POLICY "anon_select_meal_analyses" ON meal_analyses
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meal_analyses" ON meal_analyses;
CREATE POLICY "anon_insert_meal_analyses" ON meal_analyses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meal_analyses" ON meal_analyses;
CREATE POLICY "anon_update_meal_analyses" ON meal_analyses
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meal_analyses" ON meal_analyses;
CREATE POLICY "anon_delete_meal_analyses" ON meal_analyses
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_meal_analyses_created_at ON meal_analyses (created_at DESC);
