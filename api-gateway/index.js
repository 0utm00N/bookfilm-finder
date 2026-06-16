const express = require('express');
const cors = require('cors');
require('dotenv').config();

const librosRouter = require('./routes/libros');
const peliculasRouter = require('./routes/peliculas');
const adaptacionesRouter = require('./routes/adaptaciones');
const busquedaRouter = require('./routes/busqueda');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/libros', librosRouter);
app.use('/api/peliculas', peliculasRouter);
app.use('/api/adaptaciones', adaptacionesRouter);
app.use('/api/busqueda', busquedaRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});