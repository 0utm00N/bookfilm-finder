package com.bookfilm.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pelicula")
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String titulo;

    @Column(name = "titulo_original", length = 500)
    private String tituloOriginal;

    private Integer anio;

    @Column(name = "idioma_original", length = 10)
    private String idiomaOriginal;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    @Column(name = "poster_url", length = 1000)
    private String posterUrl;

    @Column(name = "tmdb_id", length = 20)
    private String tmdbId;

    @Column(name = "duracion_min")
    private Integer duracionMin;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}