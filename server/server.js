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

// Servir los archivos estáticos de la interfaz (HTML, CSS, JS) subiendo un nivel a 'client'
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta POST para recibir los mensajes del chat y procesarlos con IA
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: 'No se ha enviado ningún mensaje' });
        }

        // Llamada a la Inteligencia Artificial (modelo GPT-4o-mini)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres Echo, un bot de asistencia inteligente, simpático y experto en anime." },
                { role: "user", content: mensaje }
            ],
        });

        const respuestaIA = completion.choices[0].message.content;

        // Devolvemos la respuesta de la IA en formato JSON
        res.json({ respuesta: respuestaIA });

    } catch (error) {
        // Imprime el error real en la terminal de Render por si necesitas revisar algo
        console.error("🔴 ERROR CRÍTICO OPENAI:", error.message);
        
        // Devolvemos un mensaje amigable para que la interfaz no se quede colgada
        res.json({ respuesta: "⚠️ Hola, mi cerebro se ha saturado un momento. ¿Podrías intentar repetir la pregunta?" });
    }
});

// RUTA COMODÍN CORREGIDA UNIVERSAL: 
// Usar (.*) en lugar de * evita el error de "Missing parameter name" en las nuevas versiones de Express
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Puerto dinámico asignado por Render o puerto local 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor con IA funcionando en el puerto ${PORT}`);
});