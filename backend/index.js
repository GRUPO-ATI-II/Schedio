const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./src/controllers/user.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Body:', req.body); // Verifica si llegan los datos de Angular
    next();
});

const mongoURI = process.env.MONGO_URI || 'mongodb://schedio-mongo:27017/schedio';

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB con éxito'))
  .catch(err => console.error('!!!!Error al conectar a MongoDB:', err));

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);

app.get('/', (req, res) => {
  res.json({
    mensaje: "¡Backend de Schedio funcionando!",
    estado: "Online",
    tecnologias: ["Express 5", "Mongoose 9", "Node 22"]
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected
    res.json({
      message: "Backend reachable",
      dbStatus: state === 1 ? "Connected to MongoDB" : "Error in DB"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});