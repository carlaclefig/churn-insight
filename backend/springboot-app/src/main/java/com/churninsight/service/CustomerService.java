package com.churninsight.service;

import com.churninsight.ml.OnnxPredictionService;
import com.churninsight.model.dto.AnalysisDTO;
import com.churninsight.model.dto.CustomerResponseDTO;
import com.churninsight.model.entity.Customer;
import com.opencsv.CSVReader;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

  private final OnnxPredictionService onnxPredictionService;

  @Value("${app.csv.data-path}")
  private String csvPath;

  // ─── Mapa en memoria: CustomerID → Customer ──────────────
  private final Map<Long, Customer> customerMap = new HashMap<>();

  // ─── Carga el CSV al iniciar la aplicación ───────────────
  @PostConstruct
  public void loadCsvData() {
    try {
      log.info("Cargando datos del CSV...");

      var inputStream = getClass().getClassLoader().getResourceAsStream(csvPath);

      if (inputStream == null) {
        throw new RuntimeException("No se encontró el CSV en: " + csvPath);
      }

      try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {

        String[] header = reader.readNext();
        log.debug("Columnas CSV: {}", (Object) header);

        String[] line;
        while ((line = reader.readNext()) != null) {
          Customer customer = mapLineToCustomer(line);
          customerMap.put(customer.getCustomerId(), customer);
        }
      }

      log.info("✅ CSV cargado correctamente → {} clientes en memoria",
          customerMap.size());

    } catch (Exception e) {
      log.error("❌ Error al cargar el CSV: {}", e.getMessage());
      throw new RuntimeException("Fallo al cargar datos del CSV", e);
    }
  }

  // ─── Buscar cliente por ID y ejecutar predicción ─────────
  public CustomerResponseDTO getCustomerAnalysis(Long customerId) {

    Customer customer = customerMap.get(customerId);

    if (customer == null) {
      log.warn("Cliente no encontrado: ID {}", customerId);
      throw new RuntimeException("Cliente no encontrado con ID: " + customerId);
    }

    log.debug("Cliente encontrado: ID {} → procesando predicción...", customerId);

    AnalysisDTO analisis = onnxPredictionService.predict(customer);

    return buildResponse(customer, analisis);
  }

  // ─── Construir respuesta según nivel de riesgo ───────────
  private CustomerResponseDTO buildResponse(Customer customer, AnalysisDTO analisis) {

    // Riesgo Bajo → mensaje, sin planes
    if ("Bajo".equals(analisis.getNivelRiesgo())) {
      return CustomerResponseDTO.builder()
          .cliente(customer)
          .analisis(analisis)
          .planesRetencion(null)
          .mensaje("Cliente estable, no requiere intervención.")
          .build();
    }

    // Riesgo Medio o Alto → planes se generarán en RetentionPlanService
    return CustomerResponseDTO.builder()
        .cliente(customer)
        .analisis(analisis)
        .planesRetencion(null)
        .mensaje(null)
        .build();
  }

  // ─── Mapear línea del CSV a entidad Customer ─────────────
  private Customer mapLineToCustomer(String[] line) {

    return Customer.builder()
        .customerId(parseLong(line[0]))
        .age(parseInt(line[1]))
        .gender(line[2].trim())
        .tenure(parseInt(line[3]))
        .usageFrequency(parseInt(line[4]))
        .supportCalls(parseInt(line[5]))
        .paymentDelay(parseInt(line[6]))
        .subscriptionType(line[7].trim())
        .contractLength(line[8].trim())
        .totalSpend(parseInt(line[9]))
        .lastInteraction(parseInt(line[10]))
        .churn(parseInt(line[11]))
        .build();
  }

  // ─── Helpers de parseo seguros ───────────────────────────
  private Long parseLong(String value) {
    try {
      return Long.parseLong(value.trim());
    } catch (NumberFormatException e) {
      log.warn("No se pudo parsear Long: '{}'", value);
      return 0L;
    }
  }

  private Integer parseInt(String value) {
    try {
      return Integer.parseInt(value.trim());
    } catch (NumberFormatException e) {
      log.warn("No se pudo parsear Integer: '{}'", value);
      return 0;
    }
  }

  // ─── Exponer mapa para el DashboardService ───────────────
  public Map<Long, Customer> getAllCustomers() {
    return customerMap;
  }
}