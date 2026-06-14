package com.bookfilm.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "libro")
public class Libro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String titulo;

    @Column(length = 20)
    private String isbn;

    @Column(name = "anio_publicacion")
    private Integer anioPublicacion;

    @Column(name = "idioma_original", length = 10)
    private String idiomaOriginal;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    @Column(name = "portada_url", length = 1000)
    private String portadaUrl;

    @Column(name = "open_library_id", length = 50)
    private String openLibraryId;

    @Column(name = "google_books_id", length = 50)
    private String googleBooksId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}