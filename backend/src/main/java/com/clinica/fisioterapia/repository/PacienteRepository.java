package com.clinica.fisioterapia.repository;

import com.clinica.fisioterapia.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    @Query("SELECT p FROM Paciente p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.apellidos) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Paciente> buscarPorNombreOApellidos(@Param("termino") String termino);
}
