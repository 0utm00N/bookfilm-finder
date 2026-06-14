package com.bookfilm.backend.controller;

import com.bookfilm.backend.model.Pelicula;
import com.bookfilm.backend.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PeliculaController {

    private final PeliculaService peliculaService;

    @GetMapping
    public List<Pelicula> getAll() {
        return peliculaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> getById(@PathVariable Long id) {
        return ResponseEntity.ok(peliculaService.findById(id));
    }

    @GetMapping("/search")
    public List<Pelicula> search(@RequestParam String titulo) {
        return peliculaService.search(titulo);
    }

    @PostMapping
    public ResponseEntity<Pelicula> create(@Valid @RequestBody Pelicula pelicula) {
        return ResponseEntity.ok(peliculaService.save(pelicula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        peliculaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}