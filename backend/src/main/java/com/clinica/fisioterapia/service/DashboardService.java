package com.clinica.fisioterapia.service;

import com.clinica.fisioterapia.dto.CitaDTO;
import com.clinica.fisioterapia.dto.DashboardDTO;
import com.clinica.fisioterapia.entity.EstadoCita;
import com.clinica.fisioterapia.repository.CitaRepository;
import com.clinica.fisioterapia.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final PacienteRepository pacienteRepository;
    private final CitaRepository citaRepository;

    public DashboardDTO obtenerResumen() {
        long totalPacientes = pacienteRepository.count();
        long citasPendientes = citaRepository.countByEstado(EstadoCita.PENDIENTE);
        long citasRealizadas = citaRepository.countByEstado(EstadoCita.REALIZADA);

        BigDecimal ingresosEstimados = citaRepository.findByEstado(EstadoCita.REALIZADA).stream()
                .map(c -> c.getPrecio() != null ? c.getPrecio() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CitaDTO> proximasCitas = citaRepository
                .findByFechaGreaterThanEqualOrderByFechaAscHoraAsc(LocalDate.now())
                .stream()
                .filter(c -> c.getEstado() == EstadoCita.PENDIENTE)
                .limit(5)
                .map(CitaDTO::fromEntity)
                .toList();

        return new DashboardDTO(totalPacientes, citasPendientes, citasRealizadas, ingresosEstimados, proximasCitas);
    }
}
