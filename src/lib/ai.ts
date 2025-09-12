export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

// Lightweight offline knowledge used when no API key is provided
const knowledgeBase: Record<string, string> = {
  "waste management":
    "Waste management follows the 3 R's: Reduce, Reuse, Recycle. Separate organics for compost, recyclables (paper, metal, plastic), and landfill waste. Tip: Keep a labeled 3-bin system at home/school.",
  "recycling":
    "Rinse containers, flatten cardboard, avoid mixing food waste with recyclables. Contamination can make entire batches unrecyclable.",
  "plastic recycling":
    "Many municipalities accept #1 (PET) and #2 (HDPE). Soft films/bags usually require store drop-offs. Tip: Check local guidelines—symbols ≠ always recyclable.",
  "e-waste":
    "Electronics contain valuable metals and hazardous materials. Use certified e‑waste collection points instead of trash to prevent pollution and enable recovery.",
  "compost":
    "Compost is a mix of browns (dry leaves, cardboard) and greens (food scraps). Keep it moist like a wrung sponge and turn weekly to add oxygen.",
  "landfill":
    "Landfills generate methane when organics decompose without oxygen. Divert food scraps to compost and recyclables to reduce emissions.",
  "circular economy":
    "Design out waste, keep materials in use, and regenerate nature. Buy durable goods, repair, and prefer refill/reuse packaging.",
  "water treatment":
    "Typical steps: screening, coagulation/flocculation, sedimentation, filtration, disinfection. Tip: Protect watersheds—prevention is cheaper than treatment.",
  "wastewater":
    "Wastewater plants use primary (settling), secondary (aeration microbes), and sometimes tertiary (advanced filtration/disinfection) treatment.",
  "water conservation":
    "Fix leaks, install low‑flow fixtures, capture rainwater for gardens, and choose drought‑tolerant plants. Tip: Shorter showers save liters per minute.",
  "pollution":
    "Reduce air pollution via public transit, EVs, and clean energy; reduce water pollution by proper disposal of chemicals and stormwater management.",
  "air pollution":
    "Key sources: transport, industry, burning. Actions: carpool, use public transit, avoid open burning, and support clean energy policies.",
  "microplastics":
    "Fibers from clothes and fragments from tires enter waterways. Tip: Use a microplastic laundry filter and reduce single-use plastics.",
  "afforestation":
    "Afforestation creates new forests on non-forested land. Choose native species, ensure biodiversity, and plan maintenance for the first 2–3 years.",
  "deforestation":
    "Main drivers: agriculture, logging, roads. Impacts: biodiversity loss, emissions. Solutions: protected areas, sustainable forestry, community rights.",
  "renewable energy":
    "Solar, wind, hydro, geothermal, and biomass. Tip: Start with energy efficiency (LEDs, insulation) — it's the cheapest climate action.",
  "solar vs wind":
    "Solar suits rooftops and sunny regions; wind needs steady wind speeds and space. Both cut emissions—mix depends on local resources.",
  "carbon footprint":
    "Biggest levers: diet (less food waste, more plant‑based), transport (walk/bike/transit, EV), home energy (insulate, efficient appliances).",
  "biodiversity":
    "Protect habitats, reduce pesticides, plant native species, and connect green corridors. Tip: Backyard native gardens support pollinators.",
  "ocean pollution":
    "Sources: river plastic, fishing gear, runoff. Actions: proper waste management, capture stormwater, beach cleanups, responsible seafood.",
};

const FALLBACK_RESPONSE =
  "I can answer many environment questions (waste, water, pollution, forests, energy). Ask me anything — for broader answers, add an API key later.";

function answerFromKnowledge(query: string): string {
  const q = query.toLowerCase();
  // Simple keyword scoring
  const scores = Object.entries(knowledgeBase).map(([k, v]) => {
    const terms = k.split(/\s+/);
    const score = terms.reduce((s, t) => (q.includes(t) ? s + 1 : s), 0);
    return { k, v, score };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (!top || top.score === 0) return FALLBACK_RESPONSE;

  // Compose a concise answer with an actionable tip when possible
  return `${top.v}\n\nNeed more detail? Tell me your context (home, school, city) and goal.`;
}

export async function askAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    const last = messages.filter(m => m.role === "user").pop()?.content || "";
    return answerFromKnowledge(last);
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are EcoLearn's helpful environmental tutor. Answer clearly and concisely for students. Keep answers under 6 sentences and suggest one actionable tip when relevant.",
          },
          ...messages,
        ],
        temperature: 0.4,
      }),
    });
    if (!res.ok) throw new Error("AI request failed");
    const data = await res.json();
    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate an answer right now."
    );
  } catch {
    return "I had trouble reaching the AI service. Please try again in a moment.";
  }
}


