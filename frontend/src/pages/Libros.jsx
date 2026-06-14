import { useState, useEffect } from 'react';
import { librosApi, adaptacionesApi } from '../api/client';
import styles from './Libros.module.css';

function Libros() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [adaptaciones, setAdaptaciones] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    librosApi.getAll().then(({ data }) => {
      setLibros(data);
      setLoading(false);
    });
  }, []);

  const buscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      const { data } = await librosApi.getAll();
      setLibros(data);
    } else {
      const { data } = await librosApi.search(busqueda);
      setLibros(data);
    }
  };

  const verPeliculas = async (libroId) => {
    if (adaptaciones[libroId]) {
      setAdaptaciones(prev => ({ ...prev, [libroId]: null }));
      return;
    }
    const { data } = await adaptacionesApi.getByLibro(libroId);
    setAdaptaciones(prev => ({ ...prev, [libroId]: data }));
  };

  return (
    <div className={styles.container}>
      <h1>Libros</h1>
      <form onSubmit={buscar} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.btn}>Buscar</button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className={styles.grid}>
          {libros.map(libro => (
            <div key={libro.id} className={styles.card}>
              <h2>{libro.titulo}</h2>
              <p className={styles.meta}>{libro.anioPublicacion} · {libro.idiomaOriginal}</p>
              <p className={styles.sinopsis}>{libro.sinopsis}</p>
              <button
                className={styles.btnLink}
                onClick={() => verPeliculas(libro.id)}
              >
                {adaptaciones[libro.id] ? 'Ocultar películas' : 'Ver películas basadas en este libro'}
              </button>
              {adaptaciones[libro.id] && (
                <div className={styles.adaptaciones}>
                  {adaptaciones[libro.id].length === 0 ? (
                    <p>No hay películas registradas.</p>
                  ) : (
                    adaptaciones[libro.id].map(a => (
                      <div key={a.id} className={styles.adaptacion}>
                        <span>{a.pelicula.titulo}</span>
                        <span className={styles.year}>{a.pelicula.anio}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Libros;