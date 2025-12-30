export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const GOOGLE_KEY = process.env.GOOGLE_KEY;
  if (!GOOGLE_KEY) {
    return res.status(500).json({ error: "GOOGLE_KEY não configurado" });
  }

  const { messages = [] } = req.body;
  const userText = messages[messages.length - 1]?.content || "Olá!";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userText }]}]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sem resposta.";
    res.status(200).json({ reply, raw: data });
  } catch (err) {
    res.status(500).json({ error: "Erro interno", detail: String(err) });
  }
}
