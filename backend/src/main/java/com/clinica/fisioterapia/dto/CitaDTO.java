package com.clinica.fisioterapia.dto;

import com.clinica.fisioterapia.entity.Cita;
import com.clinica.fisioterapia.entity.EstadoCita;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record CitaDTO(
        Long id,
        @NotNull(message = "El paciente es obligatorio") Long pacienteId,
        String pacienteNombre,
        @NotNull(message = "La fecha es obligatoria") LocalDate fecha,
        @NotNull(message = "La hora es obligatoria") LocalTime hora,
        String motivo,
        EstadoCita estado,
        BigDecimal precio
) {
    public static CitaDTO fromEntity(Cita c) {
        return new CitaDTO(
                c.getId(),
                c.getPaciente().getId(),
                c.getPaciente().getNombre() + " " + c.getPaciente().getApellidos(),
                c.getFecha(),
                c.getHora(),
                c.getMotivo(),
                c.getEstado(),
                c.getPrecio()
        );
    }
}
