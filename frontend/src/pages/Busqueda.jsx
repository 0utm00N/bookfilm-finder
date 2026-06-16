import { useState } from 'react';
import { librosApi, peliculasApi, adaptacionesApi } from '../api/client';
import styles from './Busqueda.module.css';

const API = 'http://localhost:3000/api';

async function buscarEnTMDB(query) {
  const res = await fetch(`${API}/busqueda/peliculas?query=${encodeURIComponent(query)}`);
  return res.json();
}

async function buscarEnOpenLibrary(query) {
  const res = await fetch(`${API}/busqueda/libros?query=${encodeURIComponent(query)}`);
  return res.json();
}

async function importarPelicula(tmdbId) {
  const res = await fetch(`${API}/busqueda/importar/pelicula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tmdbId }),
  });
  return res.json();
}

async function importarLibro(libro) {
  const res = await fetch(`${API}/busqueda/importar/libro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(libro),
  });
  return res.json();
}

function Busqueda() {
  const [tab, setTab] = useState('peliculas');
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajes, setMensajes] = useState({});

  const buscar = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResultados([]);
    try {
      const data = tab === 'peliculas'
        ? await buscarEnTMDB(query)
        : await buscarEnOpenLibrary(query);
      setResultados(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const importar = async (item, index) => {
    setMensajes(prev => ({ ...prev, [index]: 'Importando...' }));
    try {
      if (tab === 'peliculas') {
        await importarPelicula(item.tmdbId);
      } else {
        await importarLibro(item);
      }
      setMensajes(prev => ({ ...prev, [index]: '¡Importado!' }));
    } catch (err) {
      setMensajes(prev => ({ ...prev, [index]: 'Error al importar' }));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Buscar e importar</h1>
      <p className={styles.subtitle}>
        Busca películas en TMDB o libros en Open Library e impórtalos a tu biblioteca.
      </p>

      <div className={styles.tabs}>
        <button
          className={tab === 'peliculas' ? styles.tabActive : styles.tab}
          onClick={() => { setTab('peliculas'); setResultados([]); }}
        >
          Películas (TMDB)
        </button>
        <button
          className={tab === 'libros' ? styles.tabActive : styles.tab}
          onClick={() => { setTab('libros'); setResultados([]); }}
        >
          Libros (Open Library)
        </button>
      </div>

      <form onSubmit={buscar} className={styles.searchForm}>
        <input
          type="text"
          placeholder={tab === 'peliculas' ? 'Ej: The Godfather' : 'Ej: Harry Potter'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>Buscar</button>
      </form>

      {loading && <p className={styles.loading}>Buscando...</p>}

      <div className={styles.resultados}>
        {resultados.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardContent}>
              {tab === 'peliculas' && item.posterUrl && (
                <img src={item.posterUrl} alt={item.titulo} className={styles.poster} />
              )}
              <div className={styles.info}>
                <h2>{item.titulo}</h2>
                {item.tituloOriginal && item.tituloOriginal !== item.titulo && (
                  <p className={styles.original}>{item.tituloOriginal}</p>
                )}
                <p className={styles.meta}>
                  {item.anio || item.anioPublicacion}
                  {item.idiomaOriginal && ` · ${item.idiomaOriginal}`}
                  {item.duracionMin && ` · ${item.duracionMin} min`}
                </p>
                {item.sinopsis && (
                  <p className={styles.sinopsis}>
                    {item.sinopsis.length > 200
                      ? item.sinopsis.slice(0, 200) + '...'
                      : item.sinopsis}
                  </p>
                )}
                {tab === 'libros' && item.autores?.length > 0 && (
                  <p className={styles.autores}>Por {item.autores.join(', ')}</p>
                )}
              </div>
            </div>
            <div className={styles.cardFooter}>
              <button
                className={mensajes[index] === '¡Importado!'
                  ? styles.btnImportado
                  : styles.btnImportar}
                onClick={() => importar(item, index)}
                disabled={!!mensajes[index]}
              >
                {mensajes[index] || 'Importar a mi biblioteca'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Busqueda;