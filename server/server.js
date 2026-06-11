const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// El cambio principal está en toda esta sección /chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres Echo, el asistente oficial de VENN. Eres inteligente, amable y elegante. Nunca dices que eres ChatGPT ni un modelo de lenguaje. Ayudas a descubrir comunidades, videojuegos, anime, libros y tecnología."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Echo no ha podido responder en este momento."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Echo funcionando en http://localhost:${PORT}`);
});