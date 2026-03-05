package com.churninsight.ml;

import ai.onnxruntime.*;
import com.churninsight.model.dto.AnalysisDTO;
import com.churninsight.model.entity.Customer;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Collections;

@Slf4j
@Service
public class OnnxPredictionService {

  @Value("${app.onnx.model-path}")
  private String modelPath;

  private OrtEnvironment environment;
  private OrtSession session;

  // ─── Orden estricto de features que espera el modelo ────
  private static final String[] FEATURE_ORDER = {
      "Age", "Gender", "Tenure", "Usage Frequency", "Support Calls",
      "Subscription Type", "Contract Length", "Total Spend",
      "Last Interaction", "Support_Urgency", "Monthly_Spend"
  };

  // ─── Carga el modelo al iniciar la aplicación ───────────
  @PostConstruct
  public void init() {
    try {
      log.info("Cargando modelo ONNX...");

      InputStream modelStream = getClass().getClassLoader().getResourceAsStream(modelPath);

      if (modelStream == null) {
        throw new RuntimeException("No se encontró el modelo ONNX en: " + modelPath);
      }

      Path tempModel = Files.createTempFile("modelo_churn", ".onnx");
      Files.copy(modelStream, tempModel, StandardCopyOption.REPLACE_EXISTING);

      environment = OrtEnvironment.getEnvironment();
      session = environment.createSession(tempModel.toString(), new OrtSession.SessionOptions());

      log.info("✅ Modelo ONNX cargado correctamente");
      log.info("Features esperadas: {}", (Object) FEATURE_ORDER);

    } catch (Exception e) {
      log.error("❌ Error al cargar el modelo ONNX: {}", e.getMessage());
      throw new RuntimeException("Fallo al inicializar ONNX", e);
    }
  }

  // ─── Predicción principal ────────────────────────────────
  public AnalysisDTO predict(Customer customer) {
    try {
      // 1. Construir el vector de features en orden estricto
      float[] features = buildFeatureVector(customer);

      // 2. Crear tensor de entrada
      float[][] inputMatrix = new float[][] { features };
      OnnxTensor inputTensor = OnnxTensor.createTensor(
          environment,
          inputMatrix);

      // 3. Ejecutar inferencia
      OrtSession.Result result = session.run(
          Collections.singletonMap("float_input", inputTensor));

      // 4. Extraer probabilidades
      float[][] probabilities = (float[][]) result.get(1).getValue();
      double churnProbability = probabilities[0][1] * 100.0;

      // 5. Clasificar riesgo
      String nivelRiesgo = clasificarRiesgo(churnProbability);
      String resultado = churnProbability > 30
          ? "En riesgo de abandono"
          : "Va a continuar";

      log.debug("Predicción cliente → probabilidad: {}%, riesgo: {}",
          String.format("%.2f", churnProbability), nivelRiesgo);

      return AnalysisDTO.builder()
          .resultado(resultado)
          .probabilidad(Math.round(churnProbability * 100.0) / 100.0)
          .nivelRiesgo(nivelRiesgo)
          .build();

    } catch (Exception e) {
      log.error("❌ Error durante la predicción ONNX: {}", e.getMessage());
      throw new RuntimeException("Fallo en la predicción", e);
    }
  }

  // ─── Features derivadas y de entrada ─────────────────────────
  private float[] buildFeatureVector(Customer customer) {

    double supportUrgency = (double) customer.getSupportCalls()
        / (customer.getTenure() + 1);

    double monthlySpend = (double) customer.getTotalSpend()
        / (customer.getTenure() + 1);

    int genderEncoded = customer.getGender()
        .equalsIgnoreCase("Male") ? 1 : 0;

    int subscriptionEncoded = switch (customer.getSubscriptionType()) {
      case "Standard" -> 2;
      case "Premium" -> 3;
      default -> 1; // Basic
    };

    int contractEncoded = switch (customer.getContractLength()) {
      case "Quarterly" -> 3;
      case "Annual" -> 12;
      default -> 1; // Monthly
    };

    return new float[] {
        customer.getAge(),
        genderEncoded,
        customer.getTenure(),
        customer.getUsageFrequency(),
        customer.getSupportCalls(),
        subscriptionEncoded,
        contractEncoded,
        customer.getTotalSpend(),
        customer.getLastInteraction(),
        (float) supportUrgency,
        (float) monthlySpend
    };
  }

  // ─── Clasificación de riesgo ─────────────────────────────
  private String clasificarRiesgo(double probabilidad) {
    if (probabilidad <= 30)
      return "Bajo";
    if (probabilidad <= 60)
      return "Medio";
    return "Alto";
  }

  // ─── Liberar recursos al apagar la app ──────────────────
  @PreDestroy
  public void cleanup() {
    try {
      if (session != null)
        session.close();
      if (environment != null)
        environment.close();
      log.info("Recursos ONNX liberados correctamente");
    } catch (Exception e) {
      log.warn("Error al liberar recursos ONNX: {}", e.getMessage());
    }
  }
}