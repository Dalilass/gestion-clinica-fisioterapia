package com.clinica.fisioterapia.controller;

import com.clinica.fisioterapia.dto.BonoDTO;
import com.clinica.fisioterapia.service.BonoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bonos")
@RequiredArgsConstructor
public class BonoController {

    private final BonoService bonoService;

    @GetMapping
    public List<BonoDTO> listar(@RequestParam(required = false) Long pacienteId) {
        if (pacienteId != null) {
            return bonoService.listarPorPaciente(pacienteId);
        }
        return bonoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<BonoDTO> crear(@Valid @RequestBody BonoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bonoService.crear(dto));
    }

    @PatchMapping("/{id}/usar-sesion")
    public BonoDTO usarSesion(@PathVariable Long id) {
        return bonoService.usarSesion(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        bonoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
