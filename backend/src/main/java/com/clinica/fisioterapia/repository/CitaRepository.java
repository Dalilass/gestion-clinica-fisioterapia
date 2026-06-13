package com.clinica.fisioterapia.repository;

import com.clinica.fisioterapia.entity.Cita;
import com.clinica.fisioterapia.entity.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByEstado(EstadoCita estado);

    List<Cita> findByFechaGreaterThanEqualOrderByFechaAscHoraAsc(LocalDate fecha);

    long countByEstado(EstadoCita estado);

    List<Cita> findByPacienteIdOrderByFechaDescHoraDesc(Long pacienteId);
}
