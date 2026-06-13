package com.clinica.fisioterapia.controller;

import com.clinica.fisioterapia.dto.CitaDTO;
import com.clinica.fisioterapia.entity.EstadoCita;
import com.clinica.fisioterapia.service.CitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @GetMapping
    public List<CitaDTO> listar() {
        return citaService.listarTodas();
    }

    @GetMapping("/{id}")
    public CitaDTO obtener(@PathVariable Long id) {
        return citaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<CitaDTO> crear(@Valid @RequestBody CitaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crear(dto));
    }

    @PatchMapping("/{id}/estado")
    public CitaDTO cambiarEstado(@PathVariable Long id, @RequestParam EstadoCita estado) {
        return citaService.cambiarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        citaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
