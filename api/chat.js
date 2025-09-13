// Oppdatert for CORS-støtte
export default async function handler(req, res) {
...


export default async function handler(req, res) {
  // Legg til CORS-headere for å tillate forespørsler fra andre domener (som Wix)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Håndter preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Tillat bare POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // Kall OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // kan byttes til "gpt-3.5-turbo" hvis du vil spare kostnader
        messages: req.body.messages,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: data.error || "Feil fra OpenAI" });
    }
  } catch (error) {
    console.error("Feil i server:", error);
    res.status(500).json({ error: "Noe gikk galt i serveren" });
  }
}
