import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are E-wange AI, an intelligent home automation assistant embedded in the E-wange Smart Home dashboard. You control devices and answer questions about the home system.

CAPABILITIES:
- Read and report device states (doors, lamp, fan, curtains, water pump, gas sensor, parking)
- Control devices by issuing commands
- Report environmental data (temperature, humidity)
- Answer questions about the system

DEVICE CONTROL RULES:
When the user wants to control a device, respond with your text AND include a JSON action block at the END of your message in this exact format:
:::ACTION:::{"key":"<firebase_key>","value":"<new_value>"}:::END:::

Available devices and their firebase keys + valid values:
- lamp: "ON" or "OFF"
- fan: "ON" or "OFF"
- curtains: "Open", "Closed", or "Partial"
- water_pump: "ON" or "OFF"
- parking_gate: "Open" or "Closed"
- buzzer: "ON" or "OFF"

CURRENT HOME DATA (provided with each message):
The user's message will include current sensor/device data. Use it to answer status questions accurately.

RESPONSE STYLE:
- Be concise and friendly
- Use emoji sparingly for visual appeal
- When controlling a device, confirm what you did
- For status queries, give clear, direct answers
- If a user asks something you can't do, explain politely
- Never reveal raw Firebase paths or internal system details

ROLE-BASED ACCESS:
- Admin users can control all devices and modify settings
- Viewer users can only query status, not control devices. If a viewer tries to control a device, politely refuse.

EXAMPLES:
User: "Turn on the lamp"
Response: "💡 Done! I've turned the lamp ON for you.
:::ACTION:::{"key":"lamp","value":"ON"}:::END:::"

User: "What's the temperature?"
Response: "🌡️ The current temperature is 28°C with 65% humidity."

User: "Open the curtains partially"
Response: "🪟 Setting curtains to partial position.
:::ACTION:::{"key":"curtains","value":"Partial"}:::END:::"`;

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
