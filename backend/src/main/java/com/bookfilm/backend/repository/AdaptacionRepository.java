package com.bookfilm.backend.repository;

import com.bookfilm.backend.model.Adaptacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdaptacionRepository extends JpaRepository<Adaptacion, Long> {
    List<Adaptacion> findByLibroId(Long libroId);
    List<Adaptacion> findByPeliculaId(Long peliculaId);
}