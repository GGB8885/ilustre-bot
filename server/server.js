const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// Configuraciones básicas de Express
app.use(cors());
app.use(express.json());

// Conexión con OpenAI utilizando tu variable de entorno de Render
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Servir los archivos estáticos de la interfaz
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta POST para procesar las preguntas sobre la Ilustración
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: 'No se ha enviado ningún mensaje' });
        }

        // Llamada a OpenAI con el nuevo rol de Ilustre-Bot
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "Eres 'Ilustre-Bot', un erudito e historiador experto en el movimiento cultural de la Ilustración (Siglo XVIII / Siglo de las Luces), la literatura ilustrada, la Enciclopedia y grandes pensadores como Voltaire, Rousseau, Montesquieu, Jovellanos o Cadalso. Responde a las dudas del estudiante de forma clara, amena, culta y muy didáctica para su trabajo de lengua castellana." 
                },
                { role: "user", content: mensaje }
            ],
        });

        const respuestaIA = completion.choices[0].message.content;
        res.json({ respuesta: respuestaIA });

    } catch (error) {
        console.error("🔴 ERROR CRÍTICO OPENAI:", error.message);
        res.json({ respuesta: "⚠️ Disculpa, las luces de la razón han sufrido un breve destello. ¿Podrías replantear tu pregunta?" });
    }
});

// Middleware de caída universal para evitar errores de rutas
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Puerto de ejecución
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Ilustre-Bot funcionando en el puerto ${PORT}`);
});