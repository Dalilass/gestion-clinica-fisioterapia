package com.clinica.fisioterapia.controller;

import com.clinica.fisioterapia.dto.DashboardDTO;
import com.clinica.fisioterapia.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardDTO obtenerResumen() {
        return dashboardService.obtenerResumen();
    }
}
