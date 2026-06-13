package com.clinica.fisioterapia.config;

import com.clinica.fisioterapia.entity.*;
import com.clinica.fisioterapia.repository.BonoRepository;
import com.clinica.fisioterapia.repository.CitaRepository;
import com.clinica.fisioterapia.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final PacienteRepository pacienteRepository;
    private final CitaRepository citaRepository;
    private final BonoRepository bonoRepository;

    @Override
    public void run(String... args) {
        // Pacientes ficticios
        Paciente ana = pacienteRepository.save(Paciente.builder()
                .nombre("Ana")
                .apellidos("García López")
                .telefono("612 345 678")
                .email("ana.garcia@email.com")
                .fechaNacimiento(LocalDate.of(1988, 3, 15))
                .observaciones("Dolor lumbar crónico. Evitar ejercicios de alto impacto.")
                .build());

        Paciente carlos = pacienteRepository.save(Paciente.builder()
                .nombre("Carlos")
                .apellidos("Martínez Ruiz")
                .telefono("623 456 789")
                .email("carlos.martinez@email.com")
                .fechaNacimiento(LocalDate.of(1975, 7, 22))
                .observaciones("Lesión de rodilla izquierda post-quirúrgica.")
                .build());

        Paciente laura = pacienteRepository.save(Paciente.builder()
                .nombre("Laura")
                .apellidos("Sánchez Pérez")
                .telefono("634 567 890")
                .email("laura.sanchez@email.com")
                .fechaNacimiento(LocalDate.of(1995, 11, 8))
                .observaciones("Contractura cervical recurrente por estrés laboral.")
                .build());

        Paciente miguel = pacienteRepository.save(Paciente.builder()
                .nombre("Miguel")
                .apellidos("Fernández Torres")
                .telefono("645 678 901")
                .email("miguel.fdez@email.com")
                .fechaNacimiento(LocalDate.of(1982, 5, 30))
                .observaciones("Tendinitis en hombro derecho.")
                .build());

        // Citas pasadas (realizadas)
        citaRepository.saveAll(List.of(
                Cita.builder().paciente(ana).fecha(LocalDate.now().minusDays(14))
                        .hora(LocalTime.of(9, 0)).motivo("Revisión inicial - Lumbalgia")
                        .estado(EstadoCita.REALIZADA).precio(BigDecimal.valueOf(45.00)).build(),
                Cita.builder().paciente(ana).fecha(LocalDate.now().minusDays(7))
                        .hora(LocalTime.of(9, 0)).motivo("Seguimiento - Lumbalgia")
                        .estado(EstadoCita.REALIZADA).precio(BigDecimal.valueOf(45.00)).build(),
                Cita.builder().paciente(carlos).fecha(LocalDate.now().minusDays(10))
                        .hora(LocalTime.of(10, 30)).motivo("Rehabilitación rodilla - Sesión 1")
                        .estado(EstadoCita.REALIZADA).precio(BigDecimal.valueOf(50.00)).build(),
                Cita.builder().paciente(carlos).fecha(LocalDate.now().minusDays(5))
                        .hora(LocalTime.of(10, 30)).motivo("Rehabilitación rodilla - Sesión 2")
                        .estado(EstadoCita.REALIZADA).precio(BigDecimal.valueOf(50.00)).build(),
                Cita.builder().paciente(laura).fecha(LocalDate.now().minusDays(3))
                        .hora(LocalTime.of(12, 0)).motivo("Masaje descontracturante cervical")
                        .estado(EstadoCita.CANCELADA).precio(BigDecimal.valueOf(40.00)).build()
        ));

        // Citas próximas (pendientes)
        citaRepository.saveAll(List.of(
                Cita.builder().paciente(ana).fecha(LocalDate.now().plusDays(1))
                        .hora(LocalTime.of(9, 0)).motivo("Seguimiento - Lumbalgia")
                        .estado(EstadoCita.PENDIENTE).precio(BigDecimal.valueOf(45.00)).build(),
                Cita.builder().paciente(carlos).fecha(LocalDate.now().plusDays(2))
                        .hora(LocalTime.of(10, 30)).motivo("Rehabilitación rodilla - Sesión 3")
                        .estado(EstadoCita.PENDIENTE).precio(BigDecimal.valueOf(50.00)).build(),
                Cita.builder().paciente(laura).fecha(LocalDate.now().plusDays(3))
                        .hora(LocalTime.of(12, 0)).motivo("Masaje descontracturante cervical")
                        .estado(EstadoCita.PENDIENTE).precio(BigDecimal.valueOf(40.00)).build(),
                Cita.builder().paciente(miguel).fecha(LocalDate.now().plusDays(4))
                        .hora(LocalTime.of(11, 0)).motivo("Evaluación tendinitis hombro")
                        .estado(EstadoCita.PENDIENTE).precio(BigDecimal.valueOf(45.00)).build()
        ));

        // Bonos
        bonoRepository.saveAll(List.of(
                Bono.builder().paciente(carlos).totalSesiones(10).sesionesUsadas(2)
                        .precio(BigDecimal.valueOf(450.00)).build(),
                Bono.builder().paciente(laura).totalSesiones(5).sesionesUsadas(5)
                        .precio(BigDecimal.valueOf(180.00)).build(),
                Bono.builder().paciente(miguel).totalSesiones(8).sesionesUsadas(1)
                        .precio(BigDecimal.valueOf(320.00)).build()
        ));

        System.out.println("✅ Datos de ejemplo cargados correctamente.");
    }
}
