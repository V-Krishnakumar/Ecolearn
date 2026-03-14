async function testGemini() {
  const apiKey = "AIzaSyALvVYv0_VFqPk-4gbq2wYbQj-ySAD1G0A";
  
  for (const model of ["gemini-1.5-flash", "gemini-2.5-flash"]) {
    console.log(`Testing ${model}...`);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }]
        })
      });
      const data = await res.text();
      console.log(`Response for ${model}: ${res.status}`, data.substring(0, 100) + "...");
    } catch (e) {
      console.error(e);
    }
  }
}
testGemini();
