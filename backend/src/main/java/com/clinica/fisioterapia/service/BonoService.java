package com.clinica.fisioterapia.service;

import com.clinica.fisioterapia.dto.BonoDTO;
import com.clinica.fisioterapia.entity.Bono;
import com.clinica.fisioterapia.entity.Paciente;
import com.clinica.fisioterapia.exception.ResourceNotFoundException;
import com.clinica.fisioterapia.repository.BonoRepository;
import com.clinica.fisioterapia.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BonoService {

    private final BonoRepository bonoRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<BonoDTO> listarTodos() {
        return bonoRepository.findAll().stream()
                .map(BonoDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BonoDTO> listarPorPaciente(Long pacienteId) {
        return bonoRepository.findByPacienteId(pacienteId).stream()
                .map(BonoDTO::fromEntity)
                .toList();
    }

    public BonoDTO crear(BonoDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.pacienteId()));

        Bono bono = Bono.builder()
                .paciente(paciente)
                .totalSesiones(dto.totalSesiones())
                .sesionesUsadas(dto.sesionesUsadas())
                .precio(dto.precio())
                .build();
        return BonoDTO.fromEntity(bonoRepository.save(bono));
    }

    public BonoDTO usarSesion(Long id) {
        Bono bono = bonoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bono no encontrado con id: " + id));
        if (!bono.isActivo()) {
            throw new IllegalStateException("El bono ya está agotado");
        }
        bono.setSesionesUsadas(bono.getSesionesUsadas() + 1);
        return BonoDTO.fromEntity(bonoRepository.save(bono));
    }

    public void eliminar(Long id) {
        if (!bonoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bono no encontrado con id: " + id);
        }
        bonoRepository.deleteById(id);
    }
}
