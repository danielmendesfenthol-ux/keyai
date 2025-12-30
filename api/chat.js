import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Coloque sua chave aqui como variável de ambiente
const GOOGLE_KEY = process.env.GOOGLE_KEY;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: messages[messages.length-1].content }] }]
    })
  });

  const data = await response.json();
  res.json({ reply: data.candidates[0].content.parts[0].text });
});

app.listen(3000, () => console.log("Servidor Key AI rodando na porta 3000"));
