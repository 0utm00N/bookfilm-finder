import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.hero}>
      <h1>Encuentra el libro detrás de la película</h1>
      <p>Explora las adaptaciones literarias del cine y descubre qué leer después de ver.</p>
      <div className={styles.buttons}>
        <Link to="/libros" className={styles.btnPrimary}>Ver libros</Link>
        <Link to="/peliculas" className={styles.btnSecondary}>Ver películas</Link>
      </div>
    </div>
  );
}

export default Home;