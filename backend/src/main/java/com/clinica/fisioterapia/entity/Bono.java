package com.clinica.fisioterapia.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "bonos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @NotNull(message = "El bono debe tener un paciente asignado")
    private Paciente paciente;

    @Min(value = 1, message = "El número de sesiones debe ser al menos 1")
    @Column(nullable = false)
    private int totalSesiones;

    @Column(nullable = false)
    @Builder.Default
    private int sesionesUsadas = 0;

    @Column(precision = 8, scale = 2)
    private BigDecimal precio;

    // Estado calculado: activo si quedan sesiones
    @Transient
    public boolean isActivo() {
        return sesionesUsadas < totalSesiones;
    }

    @Transient
    public int getSesionesRestantes() {
        return totalSesiones - sesionesUsadas;
    }
}
