const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai'); // Importamos OpenAI
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Conectamos con OpenAI usando tu clave secreta de Render
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Servir los archivos de la carpeta client
app.use(express.static(path.join(__dirname, '..', 'client')));

// RUTA CORREGIDA: Ahora usa IA para responder a tus preguntas
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: 'No se ha enviado ningún mensaje' });
        }

        // Llamamos a la Inteligencia Artificial de OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // El modelo más rápido y económico
            messages: [
                { role: "system", content: "Eres Echo, un bot de asistencia inteligente y simpático." },
                { role: "user", content: mensaje }
            ],
        });

        const respuestaIA = completion.choices[0].message.content;

        // Enviamos la respuesta real de la IA al chat
        res.json({ respuesta: respuestaIA });

    } catch (error) {
        console.error("Error con OpenAI:", error);
        res.status(500).json({ error: 'Error al procesar la respuesta con la IA' });
    }
});

app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor con IA funcionando en el puerto ${PORT}`);
});