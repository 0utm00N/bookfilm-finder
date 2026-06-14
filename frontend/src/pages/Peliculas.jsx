import { useState, useEffect } from 'react';
import { peliculasApi, adaptacionesApi } from '../api/client';
import styles from './Libros.module.css';

function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [adaptaciones, setAdaptaciones] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    peliculasApi.getAll().then(({ data }) => {
      setPeliculas(data);
      setLoading(false);
    });
  }, []);

  const buscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      const { data } = await peliculasApi.getAll();
      setPeliculas(data);
    } else {
      const { data } = await peliculasApi.search(busqueda);
      setPeliculas(data);
    }
  };

  const verLibros = async (peliculaId) => {
    if (adaptaciones[peliculaId]) {
      setAdaptaciones(prev => ({ ...prev, [peliculaId]: null }));
      return;
    }
    const { data } = await adaptacionesApi.getByPelicula(peliculaId);
    setAdaptaciones(prev => ({ ...prev, [peliculaId]: data }));
  };

  return (
    <div className={styles.container}>
      <h1>Películas</h1>
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
          {peliculas.map(pelicula => (
            <div key={pelicula.id} className={styles.card}>
              <h2>{pelicula.titulo}</h2>
              <p className={styles.meta}>{pelicula.anio} · {pelicula.duracionMin} min</p>
              <p className={styles.sinopsis}>{pelicula.sinopsis}</p>
              <button
                className={styles.btnLink}
                onClick={() => verLibros(pelicula.id)}
              >
                {adaptaciones[pelicula.id] ? 'Ocultar libro' : 'Ver libro en que se basa'}
              </button>
              {adaptaciones[pelicula.id] && (
                <div className={styles.adaptaciones}>
                  {adaptaciones[pelicula.id].length === 0 ? (
                    <p>No hay libros registrados.</p>
                  ) : (
                    adaptaciones[pelicula.id].map(a => (
                      <div key={a.id} className={styles.adaptacion}>
                        <span>{a.libro.titulo}</span>
                        <span className={styles.year}>{a.libro.anioPublicacion}</span>
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

export default Peliculas;