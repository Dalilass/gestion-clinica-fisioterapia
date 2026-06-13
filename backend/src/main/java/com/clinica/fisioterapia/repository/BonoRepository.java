package com.clinica.fisioterapia.repository;

import com.clinica.fisioterapia.entity.Bono;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BonoRepository extends JpaRepository<Bono, Long> {

    List<Bono> findByPacienteId(Long pacienteId);
}
