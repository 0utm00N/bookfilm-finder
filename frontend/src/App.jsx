import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Peliculas from './pages/Peliculas';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/peliculas" element={<Peliculas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;