const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuraciones básicas
app.use(cors());
app.use(express.json());

// NUEVA RUTA: Como tus archivos están sueltos en la raíz, le decimos que use la raíz del proyecto
app.use(express.static(__dirname));

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

// Forzar a que cualquier ruta cargue el index.html que tienes suelto en la raíz
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// El puerto dinámico para Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});