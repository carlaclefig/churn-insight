package com.churninsight.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;

@Slf4j
@Service
public class DashboardService {

  @Value("${app.dashboard.stats-path}")
  private String statsPath;

  private final ObjectMapper objectMapper = new ObjectMapper();

  // ─── Stats cargadas en memoria al iniciar ────────────────
  private Map<String, Object> dashboardStats;

  // ─── Carga el JSON al iniciar la aplicación ──────────────
  @PostConstruct
  public void loadDashboardStats() {
    try {
      log.info("Cargando dashboard_stats.json...");

      InputStream inputStream = getClass()
          .getClassLoader()
          .getResourceAsStream(statsPath);

      if (inputStream == null) {
        throw new RuntimeException(
            "No se encontró dashboard_stats.json en: " + statsPath);
      }

      dashboardStats = objectMapper.readValue(
          inputStream,
          new TypeReference<Map<String, Object>>() {
          });

      log.info("✅ dashboard_stats.json cargado correctamente");

    } catch (Exception e) {
      log.error("❌ Error al cargar dashboard_stats.json: {}", e.getMessage());
      throw new RuntimeException("Fallo al cargar estadísticas del dashboard", e);
    }
  }

  // ─── Retornar stats completas ────────────────────────────
  public Map<String, Object> getDashboardStats() {
    return dashboardStats;
  }
}
