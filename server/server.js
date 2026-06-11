const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Al estar el Root Directory en 'server', subimos un nivel para dar con 'client'
app.use(express.static(path.join(__dirname, '..', 'client')));

app.post('/api/mensaje', async (req, res) => {
    try {
        const { mensaje } = req.body;
        res.json({ respuesta: `Echo: ${mensaje}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
});