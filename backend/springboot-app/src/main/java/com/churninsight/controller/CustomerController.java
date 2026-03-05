package com.churninsight.controller;

import com.churninsight.ai.RetentionPlanService;
import com.churninsight.model.dto.CustomerResponseDTO;
import com.churninsight.model.dto.RetentionPlanDTO;
import com.churninsight.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

  private final CustomerService customerService;
  private final RetentionPlanService retentionPlanService;

  // ─── GET /api/customer/{id} ──────────────────────────────
  @GetMapping("/{id}")
  public ResponseEntity<?> getCustomerAnalysis(@PathVariable Long id) {
    try {
      log.info("Request recibido → GET /api/customer/{}", id);

      // 1. Obtener cliente + predicción ONNX
      CustomerResponseDTO response = customerService.getCustomerAnalysis(id);

      // 2. Si riesgo es Medio o Alto → generar planes con LLM
      String nivelRiesgo = response.getAnalisis().getNivelRiesgo();

      if ("Medio".equals(nivelRiesgo) || "Alto".equals(nivelRiesgo)) {
        log.info("Riesgo {} detectado → generando planes de retención...",
            nivelRiesgo);

        List<RetentionPlanDTO> planes = retentionPlanService.generatePlans(response.getCliente(),
            response.getAnalisis());

        response.setPlanesRetencion(planes);
      }

      log.info("✅ Respuesta lista → Cliente ID: {}, Riesgo: {}",
          id, nivelRiesgo);

      return ResponseEntity.ok(response);

    } catch (RuntimeException e) {
      log.error("❌ Error procesando cliente ID {}: {}", id, e.getMessage());
      return ResponseEntity.status(404).body(
          new ErrorResponse("Cliente no encontrado", e.getMessage()));
    } catch (Exception e) {
      log.error("❌ Error interno procesando cliente ID {}: {}", id, e.getMessage());
      return ResponseEntity.status(500).body(
          new ErrorResponse("Error interno del servidor", e.getMessage()));
    }
  }

  // ─── Record interno para respuestas de error ─────────────
  record ErrorResponse(String error, String detalle) {
  }
}
