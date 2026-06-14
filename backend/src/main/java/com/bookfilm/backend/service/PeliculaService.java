package com.bookfilm.backend.service;

import com.bookfilm.backend.model.Pelicula;
import com.bookfilm.backend.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;

    public List<Pelicula> findAll() {
        return peliculaRepository.findAll();
    }

    public Pelicula findById(Long id) {
        return peliculaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Película no encontrada con id: " + id));
    }

    public List<Pelicula> search(String titulo) {
        return peliculaRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public Pelicula save(Pelicula pelicula) {
        return peliculaRepository.save(pelicula);
    }

    public void delete(Long id) {
        peliculaRepository.deleteById(id);
    }
}