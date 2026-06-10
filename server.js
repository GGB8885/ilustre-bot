const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Corregido el método a chat.completions.create
    // 2. Corregido el modelo a "gpt-4o-mini"
    // 3. Corregido el parámetro "input" por "messages"
    const response = await openai.chat.completions.create({
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

    // 4. Corregida la forma de obtener el texto de la respuesta
    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Echo no ha podido responder en este momento."
    });
  }
});

const PORT = process.env.PORT || 3000; // Esto permite que el servidor use el puerto que le asigne internet

app.listen(PORT, () => {
  console.log(`🚀 Echo funcionando en http://localhost:${PORT}`);
});