package com.clinica.fisioterapia.service;

import com.clinica.fisioterapia.dto.CitaDTO;
import com.clinica.fisioterapia.entity.Cita;
import com.clinica.fisioterapia.entity.EstadoCita;
import com.clinica.fisioterapia.entity.Paciente;
import com.clinica.fisioterapia.exception.ResourceNotFoundException;
import com.clinica.fisioterapia.repository.CitaRepository;
import com.clinica.fisioterapia.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<CitaDTO> listarTodas() {
        return citaRepository.findAll().stream()
                .map(CitaDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public CitaDTO buscarPorId(Long id) {
        return citaRepository.findById(id)
                .map(CitaDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));
    }

    public CitaDTO crear(CitaDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.pacienteId()));

        Cita cita = Cita.builder()
                .paciente(paciente)
                .fecha(dto.fecha())
                .hora(dto.hora())
                .motivo(dto.motivo())
                .estado(dto.estado() != null ? dto.estado() : EstadoCita.PENDIENTE)
                .precio(dto.precio())
                .build();
        return CitaDTO.fromEntity(citaRepository.save(cita));
    }

    public CitaDTO cambiarEstado(Long id, EstadoCita nuevoEstado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));
        cita.setEstado(nuevoEstado);
        return CitaDTO.fromEntity(citaRepository.save(cita));
    }

    public void eliminar(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cita no encontrada con id: " + id);
        }
        citaRepository.deleteById(id);
    }
}
