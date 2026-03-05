package com.churninsight.ai;

import com.churninsight.model.dto.AnalysisDTO;
import com.churninsight.model.dto.RetentionPlanDTO;
import com.churninsight.model.entity.Customer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class RetentionPlanService {

  @Value("${app.anthropic.api-key}")
  private String apiKey;

  @Value("${app.anthropic.model}")
  private String model;

  @Value("${app.anthropic.max-tokens}")
  private int maxTokens;

  private final HttpClient httpClient = HttpClient.newHttpClient();
  private final ObjectMapper objectMapper = new ObjectMapper();

  // ─── Generar planes según nivel de riesgo ────────────────
  public List<RetentionPlanDTO> generatePlans(Customer customer, AnalysisDTO analisis) {
    try {
      log.info("Generando planes para cliente ID: {} | Riesgo: {}",
          customer.getCustomerId(), analisis.getNivelRiesgo());

      String prompt = buildPrompt(customer, analisis);
      String jsonResponse = callClaude(prompt);
      List<RetentionPlanDTO> planes = parsePlans(jsonResponse);

      log.info("✅ {} planes generados correctamente", planes.size());
      return planes;

    } catch (Exception e) {
      log.error("❌ Error generando planes de retención: {}", e.getMessage());
      throw new RuntimeException("Fallo al generar planes de retención", e);
    }
  }

  // ─── Construir prompt según nivel de riesgo ──────────────
  private String buildPrompt(Customer customer, AnalysisDTO analisis) {

    String tipoPlanes = "Alto".equals(analisis.getNivelRiesgo())
        ? """
            1. Plan de recuperación inmediata
            2. Plan de intervención personalizada
            3. Plan de fidelización a largo plazo
            """
        : """
            1. Plan de engagement
            2. Plan de mejora de experiencia
            3. Plan de incentivo personalizado
            """;

    return String.format("""
        Eres un experto en retención de clientes para una plataforma SaaS.
        Analiza el perfil de este cliente y genera exactamente 3 planes de retención.

        PERFIL DEL CLIENTE:
        - Edad: %d años
        - Género: %s
        - Antigüedad: %d meses
        - Frecuencia de uso: %d veces/mes
        - Llamadas a soporte: %d
        - Retraso en pagos: %d días
        - Tipo de suscripción: %s
        - Tipo de contrato: %s
        - Gasto total: $%d
        - Última interacción: hace %d días

        RESULTADO DEL MODELO:
        - Probabilidad de abandono: %.1f%%
        - Nivel de riesgo: %s

        PLANES A GENERAR:
        %s

        INSTRUCCIONES:
        - Analiza qué variables están más afectadas en este cliente específico
        - Basa cada plan en esas variables problemáticas
        - Sé específico y accionable, no genérico
        - La prioridad debe ser: Alta, Media o Baja

        Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown:
        [
          {
            "titulo": "...",
            "descripcion": "...",
            "acciones": ["...", "...", "..."],
            "prioridad": "..."
          }
        ]
        """,
        customer.getAge(),
        customer.getGender(),
        customer.getTenure(),
        customer.getUsageFrequency(),
        customer.getSupportCalls(),
        customer.getPaymentDelay(),
        customer.getSubscriptionType(),
        customer.getContractLength(),
        customer.getTotalSpend(),
        customer.getLastInteraction(),
        analisis.getProbabilidad(),
        analisis.getNivelRiesgo(),
        tipoPlanes);
  }

  // ─── Llamada a la API de Claude ──────────────────────────
  private String callClaude(String prompt) throws Exception {

    Map<String, Object> requestBody = Map.of(
        "model", model,
        "max_tokens", maxTokens,
        "messages", List.of(
            Map.of("role", "user", "content", prompt)));

    String requestJson = objectMapper.writeValueAsString(requestBody);

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.anthropic.com/v1/messages"))
        .header("Content-Type", "application/json")
        .header("x-api-key", apiKey)
        .header("anthropic-version", "2023-06-01")
        .POST(HttpRequest.BodyPublishers.ofString(requestJson))
        .build();

    HttpResponse<String> response = httpClient.send(
        request,
        HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() != 200) {
      log.error("Error API Claude: status={}, body={}",
          response.statusCode(), response.body());
      throw new RuntimeException("Error en API Claude: " + response.statusCode());
    }

    // Extraer texto del response
    Map<String, Object> responseMap = objectMapper.readValue(
        response.body(),
        new TypeReference<Map<String, Object>>() {
        });

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

    return (String) content.get(0).get("text");
  }

  // ─── Parsear JSON de Claude a lista de planes ────────────
  private List<RetentionPlanDTO> parsePlans(String jsonText) {
    try {
      String clean = jsonText
          .replaceAll("```json", "")
          .replaceAll("```", "")
          .trim();

      return objectMapper.readValue(
          clean,
          new TypeReference<List<RetentionPlanDTO>>() {
          });

    } catch (Exception e) {
      log.error("❌ Error parseando JSON de Claude: {}", jsonText);
      throw new RuntimeException("Respuesta del LLM no es JSON válido", e);
    }
  }
}