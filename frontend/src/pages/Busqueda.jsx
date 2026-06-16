import { useState, useEffect } from 'react';
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

async function vincular(libroId, peliculaId, tipo, notas) {
  const res = await fetch(`${API}/adaptaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ libroId, peliculaId, tipo, notas }),
  });
  return res.json();
}

function Busqueda() {
  const [tab, setTab] = useState('peliculas');
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajes, setMensajes] = useState({});

  // Items importados y listos para vincular
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // Panel de vinculación
  const [tipoAdaptacion, setTipoAdaptacion] = useState('directa');
  const [notas, setNotas] = useState('');
  const [mensajeVinculo, setMensajeVinculo] = useState('');

  // Listas de la base de datos
  const [librosBD, setLibrosBD] = useState([]);
  const [peliculasBD, setPeliculasBD] = useState([]);
  const [showPickerLibro, setShowPickerLibro] = useState(false);
  const [showPickerPelicula, setShowPickerPelicula] = useState(false);

  useEffect(() => {
    fetch(`${API}/libros`).then(r => r.json()).then(setLibrosBD);
    fetch(`${API}/peliculas`).then(r => r.json()).then(setPeliculasBD);
  }, [mensajes]);

  const buscar = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResultados([]);
    setMensajes({});
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
      let guardado;
      if (tab === 'peliculas') {
        guardado = await importarPelicula(item.tmdbId);
        setPeliculaSeleccionada(guardado);
      } else {
        guardado = await importarLibro(item);
        setLibroSeleccionado(guardado);
      }
      setMensajes(prev => ({ ...prev, [index]: '¡Importado!' }));
    } catch (err) {
      setMensajes(prev => ({ ...prev, [index]: 'Error al importar' }));
    }
  };

  const handleVincular = async () => {
    if (!libroSeleccionado || !peliculaSeleccionada) return;
    setMensajeVinculo('Vinculando...');
    try {
      await vincular(libroSeleccionado.id, peliculaSeleccionada.id, tipoAdaptacion, notas);
      setMensajeVinculo('¡Vínculo creado exitosamente!');
      setTimeout(() => {
        setMensajeVinculo('');
        setLibroSeleccionado(null);
        setPeliculaSeleccionada(null);
        setNotas('');
      }, 3000);
    } catch (err) {
      setMensajeVinculo('Error al vincular');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Buscar e importar</h1>
      <p className={styles.subtitle}>
        Busca películas en TMDB o libros en Open Library e impórtalos a tu biblioteca.
      </p>

      {/* Panel de vinculación */}
      <div className={styles.vinculoPanel}>
        <h2>Vincular libro con película</h2>
        <div className={styles.vinculoSeleccion}>

          {/* Selector de película */}
          <div className={styles.vinculoItem}>
            <p className={styles.vinculoLabel}>Película</p>
            {peliculaSeleccionada ? (
              <div className={styles.seleccionado}>
                {peliculaSeleccionada.posterUrl && (
                  <img src={peliculaSeleccionada.posterUrl} alt="" className={styles.miniPoster} />
                )}
                <div>
                  <p className={styles.seleccionadoTitulo}>{peliculaSeleccionada.titulo}</p>
                  <p className={styles.seleccionadoAnio}>{peliculaSeleccionada.anio}</p>
                </div>
                <button className={styles.btnQuitar} onClick={() => setPeliculaSeleccionada(null)}>✕</button>
              </div>
            ) : (
              <button className={styles.btnSeleccionar} onClick={() => setShowPickerPelicula(!showPickerPelicula)}>
                + Seleccionar película
              </button>
            )}
            {showPickerPelicula && !peliculaSeleccionada && (
              <div className={styles.picker}>
                {peliculasBD.map(p => (
                  <div key={p.id} className={styles.pickerItem} onClick={() => {
                    setPeliculaSeleccionada(p);
                    setShowPickerPelicula(false);
                  }}>
                    <span>{p.titulo}</span>
                    <span className={styles.pickerAnio}>{p.anio}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.vinculoFlecha}>→</div>

          {/* Selector de libro */}
          <div className={styles.vinculoItem}>
            <p className={styles.vinculoLabel}>Libro</p>
            {libroSeleccionado ? (
              <div className={styles.seleccionado}>
                <div>
                  <p className={styles.seleccionadoTitulo}>{libroSeleccionado.titulo}</p>
                  <p className={styles.seleccionadoAnio}>{libroSeleccionado.anioPublicacion}</p>
                </div>
                <button className={styles.btnQuitar} onClick={() => setLibroSeleccionado(null)}>✕</button>
              </div>
            ) : (
              <button className={styles.btnSeleccionar} onClick={() => setShowPickerLibro(!showPickerLibro)}>
                + Seleccionar libro
              </button>
            )}
            {showPickerLibro && !libroSeleccionado && (
              <div className={styles.picker}>
                {librosBD.map(l => (
                  <div key={l.id} className={styles.pickerItem} onClick={() => {
                    setLibroSeleccionado(l);
                    setShowPickerLibro(false);
                  }}>
                    <span>{l.titulo}</span>
                    <span className={styles.pickerAnio}>{l.anioPublicacion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opciones del vínculo */}
        <div className={styles.vinculoOpciones}>
          <div className={styles.vinculoOpcion}>
            <label>Tipo de adaptación</label>
            <select
              value={tipoAdaptacion}
              onChange={e => setTipoAdaptacion(e.target.value)}
              className={styles.select}
            >
              <option value="directa">Directa</option>
              <option value="inspirada_en">Inspirada en</option>
              <option value="basada_en_personajes">Basada en personajes</option>
            </select>
          </div>
          <div className={styles.vinculoOpcion}>
            <label>Notas (opcional)</label>
            <input
              type="text"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Ej: Primera parte de la trilogía"
              className={styles.input}
            />
          </div>
        </div>

        <button
          className={styles.btnVincular}
          onClick={handleVincular}
          disabled={!libroSeleccionado || !peliculaSeleccionada || !!mensajeVinculo}
        >
          Crear vínculo
        </button>
        {mensajeVinculo && (
          <p className={mensajeVinculo.includes('Error') ? styles.error : styles.exito}>
            {mensajeVinculo}
          </p>
        )}
      </div>

      {/* Búsqueda */}
      <div className={styles.tabs}>
        <button
          className={tab === 'peliculas' ? styles.tabActive : styles.tab}
          onClick={() => { setTab('peliculas'); setResultados([]); setMensajes({}); }}
        >
          Películas (TMDB)
        </button>
        <button
          className={tab === 'libros' ? styles.tabActive : styles.tab}
          onClick={() => { setTab('libros'); setResultados([]); setMensajes({}); }}
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
              {mensajes[index] === '¡Importado!' && (
                <span className={styles.seleccionarHint}>
                  {tab === 'peliculas'
                    ? '↑ Película lista en el panel de vinculación'
                    : '↑ Libro listo en el panel de vinculación'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Busqueda;