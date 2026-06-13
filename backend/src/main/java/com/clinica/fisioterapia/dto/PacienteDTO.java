package com.clinica.fisioterapia.dto;

import com.clinica.fisioterapia.entity.Paciente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PacienteDTO(
        Long id,
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "Los apellidos son obligatorios") String apellidos,
        String telefono,
        @Email(message = "El email no tiene un formato válido") String email,
        LocalDate fechaNacimiento,
        String observaciones
) {
    public static PacienteDTO fromEntity(Paciente p) {
        return new PacienteDTO(
                p.getId(),
                p.getNombre(),
                p.getApellidos(),
                p.getTelefono(),
                p.getEmail(),
                p.getFechaNacimiento(),
                p.getObservaciones()
        );
    }
}
