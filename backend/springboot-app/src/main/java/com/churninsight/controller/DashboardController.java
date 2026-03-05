package com.churninsight.controller;

import com.churninsight.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;

  // ─── GET /api/dashboard/stats ────────────────────────────
  @GetMapping("/stats")
  public ResponseEntity<?> getDashboardStats() {
    try {
      log.info("Request recibido → GET /api/dashboard/stats");

      Map<String, Object> stats = dashboardService.getDashboardStats();

      log.info("✅ Dashboard stats retornadas correctamente");
      return ResponseEntity.ok(stats);

    } catch (Exception e) {
      log.error("❌ Error obteniendo dashboard stats: {}", e.getMessage());
      return ResponseEntity.status(500).body(
          Map.of(
              "error", "Error interno del servidor",
              "detalle", e.getMessage()));
    }
  }
}