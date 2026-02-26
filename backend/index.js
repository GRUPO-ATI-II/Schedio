const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const cors = require('cors');
app.use(cors()); // Colócalo antes de tus rutas

const mongoURI = process.env.MONGO_URI || 'mongodb://schedio-mongo:27017/schedio';

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB con éxito'))
  .catch(err => console.error('!!!!Error al conectar a MongoDB:', err));

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("No!")