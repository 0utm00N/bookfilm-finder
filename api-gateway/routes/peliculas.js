const express = require('express');
const axios = require('axios');
const router = express.Router();

const BACKEND = process.env.JAVA_BACKEND_URL;

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/peliculas`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/peliculas/search`, {
      params: { titulo: req.query.titulo }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${BACKEND}/api/peliculas/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Película no encontrada' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data } = await axios.post(`${BACKEND}/api/peliculas`, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await axios.delete(`${BACKEND}/api/peliculas/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;