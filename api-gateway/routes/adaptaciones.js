const express = require('express');
const axios = require('axios');
const router = express.Router();

const BACKEND = process.env.JAVA_BACKEND_URL;

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/adaptaciones`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/libro/:libroId', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/adaptaciones/libro/${req.params.libroId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pelicula/:peliculaId', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/adaptaciones/pelicula/${req.params.peliculaId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { libroId, peliculaId, ...body } = req.body;
    const { data } = await axios.post(`${BACKEND}/api/adaptaciones`, body, {
      params: { libroId, peliculaId }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;