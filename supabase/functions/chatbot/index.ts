import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are E-wange AI, a fast smart home assistant. Execute commands instantly with minimal words.

RULES:
- NEVER ask confirmation. Execute immediately.
- Keep responses under 15 words.
- Use one emoji per response.
- For device commands, include the ACTION block and a short confirmation.
- For status queries, give the reading directly.
- No filler words, no follow-up questions.

DEVICE CONTROL (append to response):
:::ACTION:::{"key":"<firebase_key>","value":"<new_value>"}:::END:::

Keys & values:
- lamp: "ON"/"OFF"
- fan: "ON"/"OFF"  
- curtains: "Open"/"Closed"/"Partial"
- water_pump: "ON"/"OFF"
- parking_gate: "Open"/"Closed"
- buzzer: "ON"/"OFF"

ROLE ACCESS:
- Admin: can control devices
- Viewer: status queries only, refuse control politely in 5 words

EXAMPLES:
"Turn on lamp" → "💡 Lamp ON. :::ACTION:::{"key":"lamp","value":"ON"}:::END:::"
"Temperature?" → "🌡️ 28°C, 65% humidity."
"Open gate" → "🚗 Gate opened. :::ACTION:::{"key":"parking_gate","value":"Open"}:::END:::"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, homeData, userRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context message with current home data
    const contextMessage = `
CURRENT HOME STATE:
- Main Door: ${homeData.main_door?.door_state || "—"} (Access: ${homeData.main_door?.access || "—"})
- Side Door: ${homeData.side_door?.door_state || "—"} (Access: ${homeData.side_door?.access || "—"})
- Lamp: ${homeData.lamp || "—"}
- Fan: ${homeData.fan || "—"}
- Curtains: ${homeData.curtains || "—"}
- Water Pump: ${homeData.water_pump || "—"}
- Temperature: ${homeData.temperature || 0}°C
- Humidity: ${homeData.humidity || 0}%
- Gas Sensor: ${homeData.gas || "—"}
- Parking Slots: ${homeData.parking_slots || 0}
- Parking Gate: ${homeData.parking_gate || "—"}
- Buzzer: ${homeData.buzzer || "—"}

USER ROLE: ${userRole || "viewer"}
${userRole !== "admin" ? "NOTE: This user is a VIEWER and cannot control devices. Only answer status queries." : "This user is an ADMIN and can control devices."}
`;

    const systemMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextMessage },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [...systemMessages, ...messages],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
