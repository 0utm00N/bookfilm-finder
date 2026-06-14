package com.bookfilm.backend.controller;

import com.bookfilm.backend.model.Adaptacion;
import com.bookfilm.backend.service.AdaptacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/adaptaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdaptacionController {

    private final AdaptacionService adaptacionService;

    @GetMapping
    public List<Adaptacion> getAll() {
        return adaptacionService.findAll();
    }

    @GetMapping("/libro/{libroId}")
    public List<Adaptacion> getByLibro(@PathVariable Long libroId) {
        return adaptacionService.findByLibro(libroId);
    }

    @GetMapping("/pelicula/{peliculaId}")
    public List<Adaptacion> getByPelicula(@PathVariable Long peliculaId) {
        return adaptacionService.findByPelicula(peliculaId);
    }

    @PostMapping
    public ResponseEntity<Adaptacion> create(
            @RequestParam Long libroId,
            @RequestParam Long peliculaId,
            @RequestBody Adaptacion adaptacion) {
        return ResponseEntity.ok(adaptacionService.save(libroId, peliculaId, adaptacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adaptacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}