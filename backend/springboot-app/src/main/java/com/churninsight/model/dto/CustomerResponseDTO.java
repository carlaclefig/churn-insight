package com.churninsight.model.dto;

import com.churninsight.model.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {

  // ─── Datos del cliente (del CSV) ────────────────────────
  private Customer cliente;

  // ─── Resultado del modelo ONNX ──────────────────────────
  private AnalysisDTO analisis;

  // ─── Planes de retención (solo Medio y Alto) ────────────
  private List<RetentionPlanDTO> planesRetencion;

  // ─── Mensaje cuando riesgo es Bajo ──────────────────────
  private String mensaje;
}
