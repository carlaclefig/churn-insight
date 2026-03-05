package com.churninsight.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisDTO {

  private String resultado;

  private Double probabilidad;

  private String nivelRiesgo;
}
