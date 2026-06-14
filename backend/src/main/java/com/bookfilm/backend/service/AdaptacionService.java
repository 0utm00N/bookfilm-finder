package com.bookfilm.backend.service;

import com.bookfilm.backend.model.Adaptacion;
import com.bookfilm.backend.model.Libro;
import com.bookfilm.backend.model.Pelicula;
import com.bookfilm.backend.repository.AdaptacionRepository;
import com.bookfilm.backend.repository.LibroRepository;
import com.bookfilm.backend.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdaptacionService {

    private final AdaptacionRepository adaptacionRepository;
    private final LibroRepository libroRepository;
    private final PeliculaRepository peliculaRepository;

    public List<Adaptacion> findAll() {
        return adaptacionRepository.findAll();
    }

    public List<Adaptacion> findByLibro(Long libroId) {
        return adaptacionRepository.findByLibroId(libroId);
    }

    public List<Adaptacion> findByPelicula(Long peliculaId) {
        return adaptacionRepository.findByPeliculaId(peliculaId);
    }

    public Adaptacion save(Long libroId, Long peliculaId, Adaptacion adaptacion) {
        Libro libro = libroRepository.findById(libroId)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado con id: " + libroId));
        Pelicula pelicula = peliculaRepository.findById(peliculaId)
            .orElseThrow(() -> new RuntimeException("Película no encontrada con id: " + peliculaId));

        adaptacion.setLibro(libro);
        adaptacion.setPelicula(pelicula);
        return adaptacionRepository.save(adaptacion);
    }

    public void delete(Long id) {
        adaptacionRepository.deleteById(id);
    }
}