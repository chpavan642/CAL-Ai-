import { createClient } from "npm:@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WEBHOOK_URL = "https://pdpavan.app.n8n.cloud/webhook/b1c288d0-7318-45c5-aeda-53d986b726df";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    if (!webhookResponse.ok) {
      console.error("Webhook error:", webhookResponse.status);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const webhookData = await webhookResponse.json();

    const output = Array.isArray(webhookData)
      ? webhookData[0]?.output
      : webhookData.output;

    if (!output) {
      return new Response(
        JSON.stringify({ error: "No analysis returned from webhook" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("meal_analyses").insert({
      dish_name: output.dish_identification?.name || "Unknown",
      description: output.dish_identification?.main_visible_ingredients?.join(", ") || "",
      calories: output.nutritional_breakdown?.calories_kcal || null,
      protein: output.nutritional_breakdown?.protein_g != null
        ? `${output.nutritional_breakdown.protein_g}g`
        : null,
      carbohydrates: output.nutritional_breakdown?.carbohydrates_g != null
        ? `${output.nutritional_breakdown.carbohydrates_g}g`
        : null,
      fats: output.nutritional_breakdown?.fat_g != null
        ? `${output.nutritional_breakdown.fat_g}g`
        : null,
      micronutrients: output.nutritional_breakdown?.notable_micronutrients || [],
      health_rating: output.health_rating?.score || 0,
      health_reason: output.health_rating?.reason || "",
      suitability: output.suitability || {},
      alternatives: output.alternative_food_suggestions || {},
    });

    return new Response(
      JSON.stringify(output),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong while analyzing your meal." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
