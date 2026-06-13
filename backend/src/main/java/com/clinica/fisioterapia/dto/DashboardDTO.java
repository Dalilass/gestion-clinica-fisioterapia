package com.clinica.fisioterapia.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
        long totalPacientes,
        long citasPendientes,
        long citasRealizadas,
        BigDecimal ingresosEstimados,
        List<CitaDTO> proximasCitas
) {}
