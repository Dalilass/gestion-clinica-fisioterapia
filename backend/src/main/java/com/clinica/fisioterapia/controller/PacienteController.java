package com.clinica.fisioterapia.controller;

import com.clinica.fisioterapia.dto.PacienteDTO;
import com.clinica.fisioterapia.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    public List<PacienteDTO> listar(@RequestParam(required = false) String buscar) {
        if (buscar != null && !buscar.isBlank()) {
            return pacienteService.buscar(buscar);
        }
        return pacienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public PacienteDTO obtener(@PathVariable Long id) {
        return pacienteService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<PacienteDTO> crear(@Valid @RequestBody PacienteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.crear(dto));
    }

    @PutMapping("/{id}")
    public PacienteDTO actualizar(@PathVariable Long id, @Valid @RequestBody PacienteDTO dto) {
        return pacienteService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
