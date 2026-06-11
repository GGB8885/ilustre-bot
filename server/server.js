const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir los archivos estáticos desde la carpeta client subiendo un nivel
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta para procesar los mensajes del bot
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;
        res.json({ respuesta: `Echo: ${mensaje}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// SOLUCIÓN AL ERROR: Esta es la forma moderna de capturar cualquier ruta sin romper Express
app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});