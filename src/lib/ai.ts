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
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;
  const last = messages.filter(m => m.role === "user").pop()?.content || "";
  
  // Debug environment variables
  console.log("🔍 Environment Debug:", {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyStart: apiKey?.substring(0, 15) || "none",
    isPlaceholder: apiKey === "your_google_api_key_here",
    allEnvKeys: Object.keys(import.meta.env).filter(key => key.includes('GOOGLE') || key.includes('API')),
    allEnvVars: Object.keys(import.meta.env),
    googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    usingHardcoded: !import.meta.env.VITE_GOOGLE_API_KEY
  });

  
  

  
  // Always try AI first if we have an API key
  if (apiKey && apiKey !== "your_google_api_key_here" && apiKey.length > 20) {
    try {
      console.log("🤖 Using Google Gemini API with key:", apiKey.substring(0, 20) + "...");
      console.log("❓ Question:", last);
      
      // Use Google Gemini API for comprehensive environmental answers
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are EcoLearn's environmental tutor for students. Answer environmental questions clearly and educationally. Keep answers under 6 sentences, include one actionable tip when relevant, and use emojis to make it engaging. Focus on practical, student-friendly explanations. Draw inspiration from environmental topics like waste management, water treatment, pollution control, afforestation, deforestation, and renewable energy.

Student question: ${last}`
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
          }
        }),
      });
      
      console.log("Google Gemini API response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Google Gemini API Response received");
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (aiResponse) {
          console.log("🎉 AI Response:", aiResponse.substring(0, 100) + "...");
          return aiResponse;
        } else {
          console.log("⚠️ No AI response found in data");
        }
      } else {
        const errorText = await res.text();
        console.error("❌ Google Gemini API Error:", res.status, errorText);
      }
    } catch (error) {
      console.error("AI Error:", error);
      // Fall through to knowledge base
    }
  } else {
    console.log("No Google API key found, using knowledge base");
  }
  
  // Fallback to knowledge base if AI fails
  const query = last.toLowerCase();
  
  // Comprehensive environmental knowledge base with smart matching
  
  // Greetings and general questions
  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("good morning") || query.includes("good afternoon") || query.includes("what can you help") || query.includes("what do you do")) {
    return "Hello! I'm EcoLearn's environmental assistant. I can help you learn about waste management, renewable energy, water conservation, pollution control, sustainable living, climate change, and much more! What environmental topic interests you today?";
  }
  
  // Simple, practical questions students ask
  
  // How to plant a tree
  if (query.includes("how to plant") && query.includes("tree")) {
    return "Great question! Here's how to plant a tree step by step:\n\n🌱 **Step 1**: Choose the right tree for your climate and space\n🕳️ **Step 2**: Dig a hole 2-3 times wider than the root ball\n🌿 **Step 3**: Place the tree in the hole, keeping the root flare above ground\n💧 **Step 4**: Fill with soil and water thoroughly\n🌳 **Step 5**: Add mulch around the base (but not touching the trunk)\n\n💡 **Pro Tip**: Plant in fall or early spring for best results. Water regularly for the first 2 years!";
  }
  
  // Green dustbin/bin questions
  if (query.includes("green dustbin") || query.includes("green bin") || query.includes("green garbage") || query.includes("what goes in green bin") || query.includes("green waste")) {
    return "The green bin is for organic waste! Here's what goes in it:\n\n✅ **Food scraps**: Fruit peels, vegetable trimmings, coffee grounds\n✅ **Garden waste**: Grass clippings, leaves, small branches\n✅ **Paper products**: Used tissues, paper towels (if not too dirty)\n\n❌ **Don't put in**: Plastic bags, meat, dairy, or cooked food with oil\n\n💡 **Pro Tip**: Keep a small container in your kitchen for food scraps, then empty it into the green bin regularly!";
  }
  
  // Blue bin questions
  if (query.includes("blue dustbin") || query.includes("blue bin") || query.includes("blue garbage") || query.includes("what goes in blue bin") || query.includes("recycling bin")) {
    return "The blue bin is for recyclables! Here's what goes in it:\n\n✅ **Paper**: Newspapers, magazines, cardboard boxes\n✅ **Plastic bottles**: Water bottles, milk jugs, detergent bottles\n✅ **Metal cans**: Soda cans, food cans, aluminum foil\n✅ **Glass**: Bottles and jars (remove lids)\n\n❌ **Don't put in**: Food waste, plastic bags, or dirty containers\n\n💡 **Pro Tip**: Rinse containers before recycling to prevent contamination!";
  }
  
  // How to recycle
  if (query.includes("how to recycle") || query.includes("how do i recycle")) {
    return "Recycling is easy once you know the basics!\n\n♻️ **Step 1**: Check what your local area accepts\n🧽 **Step 2**: Rinse containers to remove food residue\n📦 **Step 3**: Remove lids and labels when possible\n🗂️ **Step 4**: Sort by material (paper, plastic, metal, glass)\n📋 **Step 5**: Follow your local recycling guidelines\n\n💡 **Pro Tip**: When in doubt, leave it out! Contaminated recycling can ruin entire batches.";
  }
  
  // How to save water
  if (query.includes("how to save water") || query.includes("how do i save water") || query.includes("water saving tips")) {
    return "Here are simple ways to save water at home:\n\n🚿 **Shorter showers**: Save 2.5 gallons per minute\n💧 **Fix leaks**: A dripping faucet wastes 3,000 gallons per year\n🌱 **Water plants wisely**: Water in early morning or evening\n🚰 **Turn off tap**: While brushing teeth or washing dishes\n\n💡 **Pro Tip**: Install a low-flow showerhead - you'll save water without noticing any difference!";
  }
  
  // How to save energy
  if (query.includes("how to save energy") || query.includes("how do i save energy") || query.includes("energy saving tips")) {
    return "Easy ways to save energy and money:\n\n💡 **Switch to LEDs**: Use 80% less energy than regular bulbs\n🌡️ **Adjust thermostat**: 1 degree can save 3% on heating/cooling\n🔌 **Unplug devices**: Electronics use energy even when off\n❄️ **Use fans**: Ceiling fans can reduce AC use by 40%\n\n💡 **Pro Tip**: Start with one room - replace all bulbs with LEDs and see the difference!";
  }
  
  // What is climate change
  if (query.includes("what is climate change") || query.includes("what is global warming")) {
    return "Climate change is when Earth's temperature rises over time!\n\n🌡️ **What's happening**: Earth is getting warmer due to greenhouse gases\n🌊 **Effects**: Rising sea levels, more extreme weather, melting ice\n🚗 **Causes**: Cars, factories, and power plants release CO2\n🌱 **Solutions**: Use clean energy, plant trees, reduce waste\n\n💡 **Pro Tip**: Even small actions like walking to school help fight climate change!";
  }
  
  // What is pollution
  if (query.includes("what is pollution") || query.includes("what causes pollution")) {
    return "Pollution is when harmful substances get into our environment!\n\n🌫️ **Air pollution**: Smoke from cars, factories, and fires\n🌊 **Water pollution**: Trash and chemicals in rivers and oceans\n🗑️ **Land pollution**: Litter and waste on the ground\n\n💡 **Pro Tip**: You can help by not littering, using less plastic, and walking instead of driving!";
  }
  
  // How to reduce waste
  if (query.includes("how to reduce waste") || query.includes("how do i reduce waste") || query.includes("waste reduction")) {
    return "The 3 R's help reduce waste:\n\n🔄 **Reduce**: Buy only what you need, avoid single-use items\n♻️ **Reuse**: Use containers again, donate old clothes\n♻️ **Recycle**: Put recyclables in the blue bin\n\n💡 **Pro Tip**: Start with one change - maybe bring a reusable water bottle to school!";
  }
  
  // Biodegradable waste
  if (query.includes("biodegradable waste") || query.includes("biodegradable") || query.includes("organic waste")) {
    return "Biodegradable waste is organic material that can naturally decompose!\n\n🍎 **Food scraps**: Fruit peels, vegetable trimmings, coffee grounds\n🌿 **Garden waste**: Grass clippings, leaves, small branches\n📄 **Paper products**: Used tissues, paper towels, cardboard\n⏰ **Decomposition time**: Usually 2-6 weeks to several months\n\n💡 **Pro Tip**: Put biodegradable waste in your green bin or start a compost pile - it turns into nutrient-rich soil!";
  }
  
  // Uses of water
  if (query.includes("uses of water") || query.includes("water uses") || query.includes("what is water used for")) {
    return "Water has many essential uses in our daily lives!\n\n💧 **Drinking**: Essential for human survival and health\n🌱 **Agriculture**: Growing crops and raising livestock\n🏭 **Industry**: Manufacturing, cooling, and processing\n🧽 **Cleaning**: Washing, bathing, and sanitation\n⚡ **Energy**: Hydroelectric power generation\n🌊 **Transportation**: Shipping and navigation\n\n💡 **Pro Tip**: Remember that less than 1% of Earth's water is fresh and accessible - that's why conservation is so important!";
  }
  
  // Uses of trees
  if (query.includes("uses of trees") || query.includes("tree uses") || query.includes("what are trees used for")) {
    return "Trees have countless important uses for humans and the environment!\n\n🌬️ **Clean Air**: Absorb CO2 and produce oxygen for us to breathe\n🌡️ **Climate Control**: Provide shade and cool the environment\n🌊 **Water Management**: Prevent floods and soil erosion\n🏠 **Building Materials**: Wood for construction and furniture\n🍎 **Food**: Fruits, nuts, and other edible products\n💊 **Medicine**: Many medicines come from tree compounds\n🦋 **Wildlife Habitat**: Home for countless animal species\n\n💡 **Pro Tip**: One mature tree can absorb 48 pounds of CO2 per year - that's like taking a car off the road for 1 day!";
  }
  
  // What is recycling
  if (query.includes("what is recycling") || query.includes("what does recycling mean")) {
    return "Recycling is turning old materials into new products!\n\n♻️ **How it works**: Collect used items → Sort by material → Process into new products\n📦 **What gets recycled**: Paper, plastic bottles, metal cans, glass jars\n🌍 **Why it helps**: Saves energy, reduces pollution, conserves resources\n\n💡 **Pro Tip**: Look for the recycling symbol (♻️) on products to see if they can be recycled!";
  }
  
  // What is composting
  if (query.includes("what is composting") || query.includes("what is compost") || query.includes("how does composting work")) {
    return "Composting is nature's way of recycling organic waste!\n\n🌱 **What it is**: Decomposing food scraps and yard waste into nutrient-rich soil\n🍎 **What goes in**: Fruit peels, vegetable scraps, coffee grounds, leaves\n⏰ **How long**: Takes 2-6 months depending on conditions\n\n💡 **Pro Tip**: Start with a small compost bin in your backyard or even on your balcony!";
  }
  
  // Why is the environment important
  if (query.includes("why is environment important") || query.includes("why should we protect environment") || query.includes("why care about environment")) {
    return "The environment is our home - we need to protect it!\n\n🌍 **Clean air**: Trees and plants give us oxygen to breathe\n💧 **Clean water**: We need fresh water to drink and grow food\n🌱 **Biodiversity**: All living things depend on each other\n🏠 **Our future**: A healthy planet means a healthy future for us\n\n💡 **Pro Tip**: Every small action you take to help the environment makes a big difference!";
  }
  
  // How to help the environment
  if (query.includes("how to help environment") || query.includes("how can i help environment") || query.includes("ways to help environment")) {
    return "There are so many ways you can help the environment!\n\n🚶 **Walk or bike**: Instead of asking for a car ride to nearby places\n💡 **Turn off lights**: When you leave a room\n♻️ **Recycle**: Put paper, plastic, and cans in the recycling bin\n🌱 **Plant something**: A tree, flowers, or vegetables\n\n💡 **Pro Tip**: Pick one thing to do every day - small actions add up to big changes!";
  }
  
  // What is renewable energy
  if (query.includes("what is renewable energy") || query.includes("what does renewable mean") || query.includes("clean energy")) {
    return "Renewable energy comes from sources that never run out!\n\n☀️ **Solar power**: Energy from the sun using solar panels\n💨 **Wind power**: Energy from wind using wind turbines\n🌊 **Hydro power**: Energy from flowing water\n🌱 **Why it's better**: Doesn't pollute and won't run out like fossil fuels\n\n💡 **Pro Tip**: Even your calculator can use solar power - look for solar-powered devices!";
  }
  
  // What is global warming
  if (query.includes("what is global warming") || query.includes("what causes global warming")) {
    return "Global warming is when Earth's temperature gets hotter!\n\n🌡️ **What happens**: Greenhouse gases trap heat around Earth\n🚗 **Main causes**: Cars, factories, and power plants burning fossil fuels\n🌊 **Effects**: Melting ice, rising sea levels, more extreme weather\n🌱 **Solutions**: Use clean energy, plant trees, reduce waste\n\n💡 **Pro Tip**: Think of Earth like a greenhouse - too many gases make it too hot!";
  }
  
  // How to make a difference
  if (query.includes("how can i make a difference") || query.includes("how to make a difference") || query.includes("what can i do")) {
    return "You can make a huge difference! Here are simple ways:\n\n🌱 **At home**: Turn off lights, recycle, use less water\n🚶 **Transportation**: Walk, bike, or carpool when possible\n♻️ **At school**: Use both sides of paper, bring reusable lunch containers\n🌳 **In community**: Plant trees, join clean-up events\n\n💡 **Pro Tip**: Start with one small change and build from there. Every action counts!";
  }
  
  // What is sustainability
  if (query.includes("what is sustainability") || query.includes("what does sustainable mean")) {
    return "Sustainability means meeting our needs without harming the future!\n\n🌍 **Think long-term**: Using resources so they last for future generations\n♻️ **Balance**: Taking only what we need and giving back to nature\n🌱 **Examples**: Solar energy, recycling, planting trees\n\n💡 **Pro Tip**: It's like a bank account - don't spend more than you can replace!";
  }
  
  // Why are trees important
  if (query.includes("why are trees important") || query.includes("why do we need trees") || query.includes("importance of trees")) {
    return "Trees are super important for our planet!\n\n🌬️ **Clean air**: Trees absorb CO2 and give us oxygen to breathe\n🌡️ **Cool climate**: Trees provide shade and cool the air\n🌊 **Prevent floods**: Tree roots help absorb rainwater\n🦋 **Home for wildlife**: Many animals live in and around trees\n\n💡 **Pro Tip**: One tree can absorb 48 pounds of CO2 per year - that's like taking a car off the road for 1 day!";
  }
  
  // QUIZ QUESTIONS AND ANSWERS - Students will ask these frequently!
  
  // Waste Management Quiz Questions
  if (query.includes("3 r's of waste management") || query.includes("what are the 3 r's") || query.includes("three r's")) {
    return "The 3 R's of waste management are:\n\n🔄 **Reduce**: Use less stuff and avoid unnecessary purchases\n♻️ **Reuse**: Use items again instead of throwing them away\n♻️ **Recycle**: Turn old materials into new products\n\n💡 **Quiz Answer**: Reduce, Reuse, Recycle - This is the fundamental principle of waste management!";
  }
  
  if (query.includes("glass decompose") || query.includes("glass landfill") || query.includes("glass takes longest")) {
    return "Glass takes the longest to decompose in landfills!\n\n⏰ **Glass**: Over 1 million years to decompose\n📄 **Paper**: 2-6 weeks\n🥤 **Plastic bottles**: 450 years\n🍎 **Food waste**: 2-6 weeks\n\n💡 **Quiz Answer**: Glass - That's why recycling glass is so important!";
  }
  
  if (query.includes("household waste composted") || query.includes("percentage compost") || query.includes("30% waste")) {
    return "About 30% of household waste can be composted!\n\n🍎 **Food scraps**: Fruit peels, vegetable trimmings\n🌿 **Garden waste**: Grass clippings, leaves\n📄 **Paper products**: Used tissues, paper towels\n\n💡 **Quiz Answer**: 30% - This significantly reduces what goes to landfills!";
  }
  
  // Water Treatment Quiz Questions
  if (query.includes("first step water treatment") || query.includes("water treatment screening") || query.includes("water treatment process")) {
    return "The first step in water treatment is screening!\n\n🔍 **Screening**: Remove large debris and particles\n⚗️ **Coagulation**: Add chemicals to clump small particles\n⏳ **Sedimentation**: Let particles settle to bottom\n🔬 **Filtration**: Pass through sand and gravel filters\n\n💡 **Quiz Answer**: Screening - Large debris must be removed first!";
  }
  
  if (query.includes("water disinfection") || query.includes("chlorine water") || query.includes("disinfect water")) {
    return "Chlorine is commonly used to disinfect water!\n\n🧪 **Chlorine**: Kills harmful bacteria and viruses\n💧 **UV Light**: Another disinfection method\n🌡️ **Heat**: Boiling water also disinfects\n\n💡 **Quiz Answer**: Chlorine - It's widely used to make water safe to drink!";
  }
  
  if (query.includes("earth's water fresh") || query.includes("accessible water") || query.includes("fresh water percentage")) {
    return "Less than 1% of Earth's water is fresh and accessible!\n\n🌊 **Total water**: 97% is saltwater in oceans\n🧊 **Frozen water**: 2% is frozen in ice caps\n💧 **Fresh water**: Less than 1% is available for use\n\n💡 **Quiz Answer**: Less than 1% - That's why water conservation is so important!";
  }
  
  // Pollution Quiz Questions
  if (query.includes("air pollution cities") || query.includes("vehicle emissions") || query.includes("major air pollution")) {
    return "Vehicle emissions are a major source of air pollution in cities!\n\n🚗 **Cars and trucks**: Release CO2, NOx, and particulate matter\n🏭 **Factories**: Industrial emissions\n🌪️ **Natural sources**: Dust, pollen, wildfires\n\n💡 **Quiz Answer**: Vehicle emissions - They're one of the largest sources in urban areas!";
  }
  
  if (query.includes("least pollution transport") || query.includes("electric car pollution") || query.includes("cleanest transportation")) {
    return "Electric cars produce the least pollution!\n\n⚡ **Electric cars**: Zero direct emissions\n🚌 **Public transit**: More efficient per person\n🚗 **Gasoline cars**: High emissions\n🏍️ **Motorcycles**: Also produce emissions\n\n💡 **Quiz Answer**: Electric car - They produce zero direct emissions!";
  }
  
  if (query.includes("plants pollution-free") || query.includes("plants co2 oxygen") || query.includes("plants clean air")) {
    return "Plants absorb CO₂ and produce oxygen in pollution-free zones!\n\n🌱 **Photosynthesis**: Plants take in CO2 and release oxygen\n🌬️ **Air filtration**: Plants filter pollutants from air\n🌡️ **Temperature regulation**: Plants cool the environment\n\n💡 **Quiz Answer**: They absorb CO₂ and produce oxygen - Plants are natural air purifiers!";
  }
  
  // Afforestation Quiz Questions
  if (query.includes("what is afforestation") || query.includes("afforestation definition") || query.includes("planting trees new areas")) {
    return "Afforestation is planting trees in new areas!\n\n🌱 **Definition**: Creating forests in areas that weren't previously forested\n🌳 **Purpose**: Combat climate change and restore ecosystems\n🌍 **Benefits**: Carbon storage, biodiversity, soil protection\n\n💡 **Quiz Answer**: Planting trees in new areas - It's different from reforestation!";
  }
  
  if (query.includes("trees climate change") || query.includes("trees co2") || query.includes("trees absorb carbon")) {
    return "Trees absorb carbon dioxide to help fight climate change!\n\n🌱 **Photosynthesis**: Trees take CO2 from air and store carbon\n🌡️ **Cooling effect**: Trees provide shade and cool the air\n🌊 **Water cycle**: Trees help regulate rainfall patterns\n\n💡 **Quiz Answer**: They absorb carbon dioxide - Trees are nature's carbon storage!";
  }
  
  if (query.includes("best time plant trees") || query.includes("when to plant trees") || query.includes("tree planting season")) {
    return "Spring or Fall is the best time to plant most trees!\n\n🌸 **Spring**: Moderate temperatures, good rainfall\n🍂 **Fall**: Cool weather, less stress on trees\n☀️ **Summer**: Too hot, trees need extra water\n❄️ **Winter**: Too cold, roots can't establish\n\n💡 **Quiz Answer**: Spring or Fall - These seasons provide optimal conditions!";
  }
  
  // Deforestation Quiz Questions
  if (query.includes("main cause deforestation") || query.includes("deforestation agriculture") || query.includes("deforestation causes")) {
    return "Agriculture expansion is the main cause of deforestation globally!\n\n🌾 **Agriculture**: 80% of deforestation is for farming\n🏗️ **Urban development**: Cities expanding into forests\n🌲 **Logging**: Cutting trees for timber\n\n💡 **Quiz Answer**: Agriculture expansion - It's responsible for about 80% of forest loss!";
  }
  
  if (query.includes("deforestation water cycle") || query.includes("trees rainfall") || query.includes("deforestation reduces rainfall")) {
    return "Deforestation reduces rainfall!\n\n🌳 **Transpiration**: Trees release water vapor into air\n☁️ **Cloud formation**: Water vapor forms clouds and rain\n🌧️ **Rainfall**: Less trees = less rain in the area\n\n💡 **Quiz Answer**: Reduces rainfall - Trees are essential for the water cycle!";
  }
  
  if (query.includes("ecosystem service forests") || query.includes("forest services") || query.includes("what forests provide")) {
    return "Forests provide all ecosystem services!\n\n🌱 **Carbon storage**: Trees store carbon from atmosphere\n🦋 **Biodiversity habitat**: Home to countless species\n🌍 **Soil protection**: Roots prevent erosion\n\n💡 **Quiz Answer**: All of the above - Forests provide carbon storage, biodiversity habitat, and soil protection!";
  }
  
  // Renewable Energy Quiz Questions
  if (query.includes("not renewable energy") || query.includes("coal renewable") || query.includes("fossil fuel renewable")) {
    return "Coal is NOT a renewable energy source!\n\n☀️ **Solar power**: Energy from sun (renewable)\n💨 **Wind power**: Energy from wind (renewable)\n⚡ **Hydroelectric**: Energy from water (renewable)\n🔥 **Coal**: Fossil fuel that takes millions of years to form (non-renewable)\n\n💡 **Quiz Answer**: Coal - It's a fossil fuel, not renewable!";
  }
  
  if (query.includes("solar panels work") || query.includes("solar light heat") || query.includes("photovoltaic effect")) {
    return "Solar panels work with light from the sun!\n\n☀️ **Photovoltaic effect**: Light (photons) creates electricity\n🔋 **Solar cells**: Convert light directly to electricity\n🌡️ **Heat vs Light**: Solar panels use light, not heat\n\n💡 **Quiz Answer**: Light from the sun - Solar panels convert photons to electricity!";
  }
  
  if (query.includes("renewable energy night") || query.includes("solar night") || query.includes("wind hydro night")) {
    return "Both wind and hydroelectric work best at night!\n\n☀️ **Solar**: Only works during daylight hours\n💨 **Wind**: Works 24/7 when wind is blowing\n🌊 **Hydroelectric**: Works 24/7 with flowing water\n\n💡 **Quiz Answer**: Both B and C (Wind and Hydroelectric) - They can generate power 24/7!";
  }
  
  // LESSON CONTENT SUPPORT - Help students understand lesson topics
  
  // Waste Management Lesson
  if (query.includes("waste management lesson") || query.includes("waste management content") || query.includes("waste management overview")) {
    return "Waste Management Lesson Overview:\n\n📚 **What you'll learn**: The 3 R's, proper sorting, composting, and community strategies\n⏱️ **Duration**: 15 minutes\n📊 **Difficulty**: Beginner\n🎯 **Key topics**:\n• Reduce, Reuse, Recycle principles\n• Different types of waste\n• Composting methods\n• Community waste management\n\n💡 **Study Tip**: Focus on the 3 R's - they're the foundation of waste management!";
  }
  
  // Water Treatment Lesson
  if (query.includes("water treatment lesson") || query.includes("water treatment content") || query.includes("water purification")) {
    return "Water Treatment Lesson Overview:\n\n📚 **What you'll learn**: Multi-step purification process, wastewater treatment, water resource protection\n⏱️ **Duration**: 12 minutes\n📊 **Difficulty**: Beginner\n🎯 **Key topics**:\n• Screening and filtration\n• Sedimentation and coagulation\n• Disinfection methods\n• Wastewater treatment plants\n\n💡 **Study Tip**: Remember the order - Screening → Coagulation → Sedimentation → Filtration → Disinfection!";
  }
  
  // Pollution-Free Zones Lesson
  if (query.includes("pollution-free lesson") || query.includes("pollution zones") || query.includes("clean environments")) {
    return "Pollution-Free Zones Lesson Overview:\n\n📚 **What you'll learn**: Air quality monitoring, green transportation, emission controls, community initiatives\n⏱️ **Duration**: 18 minutes\n📊 **Difficulty**: Intermediate\n🎯 **Key topics**:\n• Types of pollution\n• Air quality monitoring\n• Green transportation solutions\n• Industrial emission controls\n\n💡 **Study Tip**: Focus on solutions - how communities create and maintain clean environments!";
  }
  
  // Afforestation Lesson
  if (query.includes("afforestation lesson") || query.includes("tree planting lesson") || query.includes("forest creation")) {
    return "Afforestation Lesson Overview:\n\n📚 **What you'll learn**: Tree species selection, planting techniques, ecosystem development, climate benefits\n⏱️ **Duration**: 14 minutes\n📊 **Difficulty**: Beginner\n🎯 **Key topics**:\n• Tree species selection\n• Planting techniques\n• Forest ecosystem development\n• Climate regulation benefits\n\n💡 **Study Tip**: Remember that afforestation is creating NEW forests, not replacing existing ones!";
  }
  
  // Deforestation Lesson
  if (query.includes("deforestation lesson") || query.includes("forest loss") || query.includes("deforestation causes")) {
    return "Deforestation Lesson Overview:\n\n📚 **What you'll learn**: Causes of forest loss, environmental impacts, prevention strategies, conservation methods\n⏱️ **Duration**: 16 minutes\n📊 **Difficulty**: Intermediate\n🎯 **Key topics**:\n• Main causes (agriculture, logging, urban development)\n• Environmental impacts\n• Climate change effects\n• Conservation strategies\n\n💡 **Study Tip**: Focus on the causes and impacts - understanding the problem helps find solutions!";
  }
  
  // Renewable Energy Lesson
  if (query.includes("renewable energy lesson") || query.includes("clean energy lesson") || query.includes("solar wind energy")) {
    return "Renewable Energy Lesson Overview:\n\n📚 **What you'll learn**: Solar, wind, hydro technologies, efficiency, costs, environmental benefits\n⏱️ **Duration**: 20 minutes\n📊 **Difficulty**: Advanced\n🎯 **Key topics**:\n• Solar power technology\n• Wind energy systems\n• Hydroelectric power\n• Energy efficiency\n• Global energy transition\n\n💡 **Study Tip**: This is the most advanced lesson - take your time understanding each technology!";
  }
  
  // QUIZ HELP - General quiz assistance
  if (query.includes("quiz help") || query.includes("quiz questions") || query.includes("quiz answers") || query.includes("help with quiz")) {
    return "I can help you with quiz questions! Here are the topics I can assist with:\n\n🗑️ **Waste Management Quiz**: 3 R's, glass decomposition, composting percentages\n💧 **Water Treatment Quiz**: Treatment steps, disinfection, fresh water availability\n🌫️ **Pollution Quiz**: Air pollution sources, clean transportation, plant benefits\n🌳 **Afforestation Quiz**: Tree planting, climate benefits, best planting times\n🌲 **Deforestation Quiz**: Causes, water cycle effects, ecosystem services\n⚡ **Renewable Energy Quiz**: Energy sources, solar panels, 24/7 power generation\n\n💡 **How to ask**: Just ask about any quiz question or topic! For example: 'What are the 3 R's?' or 'What is afforestation?'";
  }
  
  // STUDY TIPS
  if (query.includes("study tips") || query.includes("how to study") || query.includes("quiz preparation")) {
    return "Here are study tips for your environmental quizzes:\n\n📚 **Review lesson content**: Watch the videos and read the materials\n🎯 **Focus on key concepts**: Each lesson has main topics to understand\n🔄 **Practice with me**: Ask me quiz questions to test your knowledge\n⏰ **Take your time**: Don't rush through the material\n📝 **Take notes**: Write down important facts and explanations\n\n💡 **Pro Tip**: I can help you practice any quiz question - just ask me!";
  }
  
  // Waste Management & Recycling
  if (query.includes("waste") || query.includes("recycle") || query.includes("trash") || query.includes("garbage") || query.includes("rubbish") || query.includes("disposal") || query.includes("landfill") || query.includes("compost") || query.includes("bin") || query.includes("throw away") || query.includes("e-waste") || query.includes("electronic waste")) {
    if (query.includes("e-waste") || query.includes("electronic")) {
      return "E-waste is a growing environmental concern! Here's what you need to know:\n\n📱 **What is E-waste**: Old phones, computers, TVs, and other electronics\n⚠️ **Why it's dangerous**: Contains toxic materials like lead, mercury, and cadmium\n♻️ **Proper disposal**: Use certified e-waste collection centers, never throw in regular trash\n\n💡 **Action Tip**: Check if your local electronics store offers take-back programs. Many offer free recycling for old devices!";
    }
    return "Great question about waste management! Here are the key principles:\n\n🔄 **The 3 R's**: Reduce, Reuse, Recycle\n♻️ **Recycling**: Rinse containers, separate materials, check local guidelines\n🗑️ **Composting**: Mix browns (leaves, cardboard) with greens (food scraps)\n\n💡 **Action Tip**: Set up a 3-bin system at home - one for recyclables, one for compost, one for landfill waste. This simple step can reduce your household waste by 60%!";
  }
  
  // Energy & Renewable Energy
  if (query.includes("energy") || query.includes("solar") || query.includes("wind") || query.includes("renewable") || query.includes("electricity") || query.includes("power") || query.includes("green energy") || query.includes("clean energy") || query.includes("hydro") || query.includes("geothermal") || query.includes("battery") || query.includes("solar panel")) {
    if (query.includes("solar panel") || query.includes("solar installation")) {
      return "Solar panels are a great investment! Here's what you should know:\n\n☀️ **How they work**: Convert sunlight directly into electricity using photovoltaic cells\n💰 **Cost savings**: Can reduce electricity bills by 50-90%\n🏠 **Installation**: Best on south-facing roofs with minimal shading\n\n💡 **Action Tip**: Get quotes from 3+ certified installers and check for local rebates and tax credits!";
    }
    return "Excellent question about renewable energy! Here's what you should know:\n\n☀️ **Solar Power**: Great for rooftops and sunny areas\n💨 **Wind Energy**: Needs steady wind speeds and space\n⚡ **Energy Efficiency**: Start with LED bulbs and insulation - it's the cheapest climate action!\n\n💡 **Action Tip**: Replace your old light bulbs with LEDs today. You'll save 80% on lighting costs and reduce your carbon footprint immediately!";
  }
  
  // Water Conservation & Treatment
  if (query.includes("water") || query.includes("conservation") || query.includes("save water") || query.includes("drought") || query.includes("rain") || query.includes("ocean") || query.includes("river") || query.includes("treatment") || query.includes("drinking water") || query.includes("water quality") || query.includes("rainwater") || query.includes("greywater")) {
    if (query.includes("rainwater") || query.includes("rain barrel")) {
      return "Rainwater harvesting is fantastic for water conservation!\n\n🌧️ **Benefits**: Reduces water bills, provides chemical-free water for plants\n🛢️ **Setup**: Install rain barrels under downspouts, use mesh screens to filter debris\n🌱 **Uses**: Water gardens, wash cars, flush toilets (with proper treatment)\n\n💡 **Action Tip**: Start with a simple 50-gallon rain barrel. You can collect 600+ gallons per year from just one downspout!";
    }
    return "Water conservation is crucial for our planet! Here are the essentials:\n\n💧 **Fix Leaks**: A single leaky faucet can waste 3,000 gallons per year\n🚿 **Shorter Showers**: Each minute saves 2.5 gallons\n🌱 **Drought-Tolerant Plants**: Choose native species for your garden\n\n💡 **Action Tip**: Install a low-flow showerhead today. It uses 40% less water and you won't even notice the difference!";
  }
  
  // Pollution & Air Quality
  if (query.includes("pollution") || query.includes("air") || query.includes("clean") || query.includes("smog") || query.includes("emissions") || query.includes("carbon") || query.includes("climate") || query.includes("global warming") || query.includes("air quality") || query.includes("indoor air") || query.includes("ventilation")) {
    if (query.includes("indoor air") || query.includes("air quality at home")) {
      return "Indoor air quality is often worse than outdoor air! Here's how to improve it:\n\n🌿 **Houseplants**: Spider plants, peace lilies, and snake plants filter toxins\n💨 **Ventilation**: Open windows daily, use exhaust fans in kitchen and bathroom\n🧹 **Cleaning**: Use natural cleaners, vacuum regularly, avoid synthetic fragrances\n\n💡 **Action Tip**: Add 2-3 air-purifying plants to your living room today. They're beautiful and functional!";
    }
    return "Pollution control is essential for our health and environment!\n\n🚗 **Transport**: Use public transit, carpool, or walk when possible\n🏭 **Industry**: Support companies with clean energy practices\n🌿 **Air Quality**: Plant trees and avoid open burning\n\n💡 **Action Tip**: Try walking or biking for short trips this week. You'll reduce air pollution and get some exercise too!";
  }
  
  // Forests & Biodiversity
  if (query.includes("forest") || query.includes("tree") || query.includes("deforestation") || query.includes("afforestation") || query.includes("biodiversity") || query.includes("nature") || query.includes("wildlife") || query.includes("ecosystem") || query.includes("habitat") || query.includes("species") || query.includes("extinction")) {
    if (query.includes("biodiversity") || query.includes("species") || query.includes("extinction")) {
      return "Biodiversity is the foundation of life on Earth!\n\n🦋 **Why it matters**: Each species plays a unique role in ecosystems\n📉 **Current crisis**: We're losing species 1000x faster than natural rates\n🌱 **How to help**: Plant native species, reduce pesticide use, support conservation\n\n💡 **Action Tip**: Create a wildlife-friendly garden with native plants. Even a small space can support local pollinators!";
    }
    return "Forests are vital for our planet! Here's what you should know:\n\n🌳 **Deforestation**: Main causes are agriculture, logging, and urban expansion\n🌱 **Afforestation**: Planting new forests helps combat climate change\n🦋 **Biodiversity**: Forests support 80% of terrestrial species\n\n💡 **Action Tip**: Plant a native tree in your yard or community this month. One tree can absorb 48 pounds of CO2 per year!";
  }
  
  // Plastic & Ocean Pollution
  if (query.includes("plastic") || query.includes("microplastic") || query.includes("ocean") || query.includes("marine") || query.includes("sea") || query.includes("beach") || query.includes("single-use") || query.includes("packaging") || query.includes("straw") || query.includes("bag")) {
    if (query.includes("microplastic") || query.includes("micro plastic")) {
      return "Microplastics are tiny plastic particles that are everywhere!\n\n🔬 **What they are**: Plastic pieces smaller than 5mm, often invisible to the naked eye\n🌊 **Sources**: Clothing fibers, tire wear, broken-down plastic waste\n🍽️ **Health impact**: Found in our food, water, and even the air we breathe\n\n💡 **Action Tip**: Use a microplastic laundry filter and choose natural fiber clothing when possible!";
    }
    return "Plastic pollution is a major environmental challenge!\n\n🔄 **Reduce Single-Use**: Bring reusable bags, bottles, and containers\n♻️ **Proper Disposal**: Never litter, always recycle when possible\n🌊 **Ocean Impact**: 8 million tons of plastic enter oceans yearly\n\n💡 **Action Tip**: Start using a reusable water bottle today. You'll save money and prevent hundreds of plastic bottles from entering landfills!";
  }
  
  // Climate Change & Carbon Footprint
  if (query.includes("carbon") || query.includes("footprint") || query.includes("emissions") || query.includes("greenhouse") || query.includes("co2") || query.includes("climate change") || query.includes("global warming") || query.includes("temperature") || query.includes("ice") || query.includes("sea level")) {
    if (query.includes("carbon footprint") || query.includes("reduce carbon")) {
      return "Reducing your carbon footprint is crucial for climate action!\n\n🚗 **Transport**: Walk, bike, or use public transit when possible\n🏠 **Home Energy**: Use LED bulbs, insulate, and choose efficient appliances\n🍽️ **Diet**: Eat more plant-based foods and reduce food waste\n\n💡 **Action Tip**: Calculate your carbon footprint online today. Awareness is the first step to making meaningful changes!";
    }
    return "Climate change is the defining challenge of our time!\n\n🌡️ **The science**: Human activities are warming the planet at unprecedented rates\n🌊 **Impacts**: Rising sea levels, extreme weather, ecosystem disruption\n⚡ **Solutions**: Renewable energy, energy efficiency, sustainable transportation\n\n💡 **Action Tip**: Start with one small change this week - maybe walk instead of drive for short trips!";
  }
  
  // Sustainable Living & Green Lifestyle
  if (query.includes("sustainable") || query.includes("green living") || query.includes("eco-friendly") || query.includes("zero waste") || query.includes("minimalist") || query.includes("organic") || query.includes("local") || query.includes("farmers market") || query.includes("green home")) {
    return "Sustainable living is about making conscious choices for the planet!\n\n🏠 **Green Home**: Energy-efficient appliances, natural cleaning products, good insulation\n🛒 **Conscious Shopping**: Buy less, choose quality, support local businesses\n🌱 **Food Choices**: Eat local, seasonal, and plant-based when possible\n\n💡 **Action Tip**: Start a small herb garden on your windowsill. Fresh herbs reduce packaging and taste amazing!";
  }
  
  // Transportation & Mobility
  if (query.includes("transport") || query.includes("car") || query.includes("bike") || query.includes("walk") || query.includes("public transit") || query.includes("electric vehicle") || query.includes("ev") || query.includes("hybrid") || query.includes("commute")) {
    return "Transportation is a major source of emissions, but there are great alternatives!\n\n🚲 **Active Transport**: Walking and biking are zero-emission and healthy\n🚌 **Public Transit**: Buses and trains are much more efficient per person\n⚡ **Electric Vehicles**: EVs produce zero direct emissions and are getting cheaper\n\n💡 **Action Tip**: Try 'car-free Fridays' - walk, bike, or use public transit one day per week!";
  }
  
  // Food & Agriculture
  if (query.includes("food") || query.includes("diet") || query.includes("meat") || query.includes("vegetarian") || query.includes("vegan") || query.includes("organic") || query.includes("farming") || query.includes("agriculture") || query.includes("garden") || query.includes("grow")) {
    return "Food choices have a huge environmental impact!\n\n🌱 **Plant-based**: Reduces water use, land use, and emissions significantly\n🏡 **Local & Seasonal**: Reduces transportation emissions and supports local farmers\n🌿 **Organic**: Reduces pesticide use and supports soil health\n\n💡 **Action Tip**: Try 'Meatless Monday' - replace one meat meal per week with plant-based options!";
  }
  
  // Use the original knowledge base as fallback
  return answerFromKnowledge(last);
}


