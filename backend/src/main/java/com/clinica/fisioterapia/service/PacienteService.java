package com.clinica.fisioterapia.service;

import com.clinica.fisioterapia.dto.PacienteDTO;
import com.clinica.fisioterapia.entity.Paciente;
import com.clinica.fisioterapia.exception.ResourceNotFoundException;
import com.clinica.fisioterapia.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<PacienteDTO> listarTodos() {
        return pacienteRepository.findAll().stream()
                .map(PacienteDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PacienteDTO buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .map(PacienteDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
    }

    @Transactional(readOnly = true)
    public List<PacienteDTO> buscar(String termino) {
        return pacienteRepository.buscarPorNombreOApellidos(termino).stream()
                .map(PacienteDTO::fromEntity)
                .toList();
    }

    public PacienteDTO crear(PacienteDTO dto) {
        Paciente paciente = Paciente.builder()
                .nombre(dto.nombre())
                .apellidos(dto.apellidos())
                .telefono(dto.telefono())
                .email(dto.email())
                .fechaNacimiento(dto.fechaNacimiento())
                .observaciones(dto.observaciones())
                .build();
        return PacienteDTO.fromEntity(pacienteRepository.save(paciente));
    }

    public PacienteDTO actualizar(Long id, PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
        paciente.setNombre(dto.nombre());
        paciente.setApellidos(dto.apellidos());
        paciente.setTelefono(dto.telefono());
        paciente.setEmail(dto.email());
        paciente.setFechaNacimiento(dto.fechaNacimiento());
        paciente.setObservaciones(dto.observaciones());
        return PacienteDTO.fromEntity(pacienteRepository.save(paciente));
    }

    public void eliminar(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paciente no encontrado con id: " + id);
        }
        pacienteRepository.deleteById(id);
    }
}
