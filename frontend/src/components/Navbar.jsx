import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        BookFilm
      </Link>
      <div className={styles.links}>
        <Link to="/libros">Libros</Link>
        <Link to="/peliculas">Películas</Link>
        <Link to="/busqueda">Buscar</Link>
      </div>
    </nav>
  );
}

export default Navbar;