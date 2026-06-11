const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuraciones básicas
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN CLAVE: Muestra la carpeta del cliente (HTML, CSS, JS) en el enlace principal
app.use(express.static(path.join(__dirname, '../client')));

// Aquí van tus rutas de la API del bot (por ejemplo, para escuchar los mensajes)
app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;
        // Aquí dentro irá tu lógica con OpenAI o lo que responda tu bot...
        res.json({ respuesta: `Echo: ${mensaje}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// El puerto dinámico que Render necesita obligatoriamente
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});