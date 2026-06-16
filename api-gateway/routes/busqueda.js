const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = process.env.TMDB_BASE_URL;
const OL_URL = process.env.OPEN_LIBRARY_BASE_URL;

// Buscar películas en TMDB
router.get('/peliculas', async (req, res) => {
  try {
    const { query } = req.query;
    const { data } = await axios.get(`${TMDB_URL}/search/movie`, {
      params: {
        api_key: TMDB_KEY,
        query,
        language: 'es-ES',
      }
    });

    const resultados = data.results.map(p => ({
      tmdbId: String(p.id),
      titulo: p.title,
      tituloOriginal: p.original_title,
      anio: p.release_date ? parseInt(p.release_date.split('-')[0]) : null,
      sinopsis: p.overview,
      posterUrl: p.poster_path
        ? `https://image.tmdb.org/t/p/w500${p.poster_path}`
        : null,
      idiomaOriginal: p.original_language,
    }));

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar libros en Open Library
router.get('/libros', async (req, res) => {
  try {
    const { query } = req.query;
    const { data } = await axios.get(`${OL_URL}/search.json`, {
      params: {
        q: query,
        limit: 10,
        fields: 'key,title,author_name,first_publish_year,isbn,language,description',
      }
    });

    const resultados = data.docs.map(l => ({
      openLibraryId: l.key,
      titulo: l.title,
      anioPublicacion: l.first_publish_year || null,
      isbn: l.isbn ? l.isbn[0] : null,
      idiomaOriginal: l.language ? l.language[0] : null,
      sinopsis: typeof l.description === 'string'
        ? l.description
        : l.description?.value || null,
      autores: l.author_name || [],
    }));

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Importar película de TMDB directo a la base de datos
router.post('/importar/pelicula', async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const BACKEND = process.env.JAVA_BACKEND_URL;

    const { data: tmdb } = await axios.get(`${TMDB_URL}/movie/${tmdbId}`, {
      params: { api_key: TMDB_KEY, language: 'es-ES' }
    });

    const pelicula = {
      titulo: tmdb.title,
      tituloOriginal: tmdb.original_title,
      anio: tmdb.release_date ? parseInt(tmdb.release_date.split('-')[0]) : null,
      sinopsis: tmdb.overview,
      posterUrl: tmdb.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
        : null,
      idiomaOriginal: tmdb.original_language,
      duracionMin: tmdb.runtime || null,
      tmdbId: String(tmdb.id),
    };

    const { data: guardada } = await axios.post(`${BACKEND}/api/peliculas`, pelicula);
    res.json(guardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Importar libro de Open Library directo a la base de datos
router.post('/importar/libro', async (req, res) => {
  try {
    const { openLibraryId, titulo, anioPublicacion, isbn, idiomaOriginal, sinopsis } = req.body;
    const BACKEND = process.env.JAVA_BACKEND_URL;

    const libro = {
      titulo,
      anioPublicacion,
      isbn,
      idiomaOriginal,
      sinopsis,
      openLibraryId,
    };

    const { data: guardado } = await axios.post(`${BACKEND}/api/libros`, libro);
    res.json(guardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;