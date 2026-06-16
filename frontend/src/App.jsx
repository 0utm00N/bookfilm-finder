import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Peliculas from './pages/Peliculas';
import Busqueda from './pages/Busqueda';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/busqueda" element={<Busqueda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;