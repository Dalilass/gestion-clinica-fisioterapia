package com.clinica.fisioterapia.dto;

import com.clinica.fisioterapia.entity.Bono;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BonoDTO(
        Long id,
        @NotNull(message = "El paciente es obligatorio") Long pacienteId,
        String pacienteNombre,
        @Min(1) int totalSesiones,
        int sesionesUsadas,
        int sesionesRestantes,
        BigDecimal precio,
        boolean activo
) {
    public static BonoDTO fromEntity(Bono b) {
        return new BonoDTO(
                b.getId(),
                b.getPaciente().getId(),
                b.getPaciente().getNombre() + " " + b.getPaciente().getApellidos(),
                b.getTotalSesiones(),
                b.getSesionesUsadas(),
                b.getSesionesRestantes(),
                b.getPrecio(),
                b.isActivo()
        );
    }
}
