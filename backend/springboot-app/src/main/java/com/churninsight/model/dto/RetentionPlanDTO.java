package com.churninsight.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetentionPlanDTO {

  // ─── Título del plan ────────────────────────────────────
  private String titulo;

  // ─── Descripción estratégica ────────────────────────────
  private String descripcion;

  // ─── Acciones concretas ─────────────────────────────────
  private java.util.List<String> acciones;

  private String prioridad;
}