package com.churninsight.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

  // ─── Identificador ──────────────────────────────────────
  private Long customerId;

  // ─── Datos demográficos ─────────────────────────────────
  private Integer age;
  private String gender;

  // ─── Comportamiento del cliente ─────────────────────────
  private Integer tenure;
  private Integer usageFrequency;
  private Integer supportCalls;
  private Integer paymentDelay;

  // ─── Suscripción ────────────────────────────────────────
  private String subscriptionType;
  private String contractLength;

  // ─── Financiero ─────────────────────────────────────────
  private Integer totalSpend;
  private Integer lastInteraction;

  // ─── Etiqueta real del CSV ──────────────────────────────
  private Integer churn;
}
