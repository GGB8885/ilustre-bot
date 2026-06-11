const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuraciones básicas
app.use(cors());
app.use(express.json());

// RUTA CORREGIDA: Sube un nivel desde 'server' y busca la carpeta 'client'
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta para recibir los mensajes del bot
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;
        res.json({ respuesta: `Echo: ${mensaje}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Forzar a que cualquier otra ruta cargue el index.html (Evita el Cannot GET /)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// El puerto dinámico para Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});