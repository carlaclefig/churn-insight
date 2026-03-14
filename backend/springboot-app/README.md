# Churn Insight – Backend

API REST construida con Spring Boot 3 que integra un modelo ONNX para predicción de churn y Claude para generación de planes de retención.

## Arquitectura
```
com.churninsight/
├── controller/     → Endpoints REST
├── service/        → Lógica de negocio
├── ml/             → Integración ONNX Runtime
├── ai/             → Integración Claude API
├── model/
│   ├── entity/     → Entidad Customer
│   └── dto/        → DTOs de respuesta
└── config/         → CORS y configuración
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/customer/{id}` | Datos del cliente + predicción ONNX + planes |
| GET | `/api/dashboard/stats` | Estadísticas del dashboard |

## Respuesta `/api/customer/{id}`
```json
{
  "cliente": { ... },
  "analisis": {
    "resultado": "En riesgo de abandono",
    "probabilidad": 74.2,
    "nivelRiesgo": "Alto"
  },
  "planesRetencion": [
    {
      "titulo": "...",
      "descripcion": "...",
      "acciones": ["...", "..."],
      "prioridad": "Alta"
    }
  ],
  "mensaje": null
}
```

## Configuración

Copia el archivo de ejemplo y edita con tus valores:
```bash
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties
```

## Correr localmente
```bash
./mvnw spring-boot:run
```

## Correr con Docker
```bash
docker-compose up --build backend
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | API key de Claude |

## Features del modelo ONNX

El modelo espera exactamente estas 11 features en este orden:
```
Age, Gender, Tenure, Usage Frequency, Support Calls,
Subscription Type, Contract Length, Total Spend,
Last Interaction, Support_Urgency, Monthly_Spend
```

> `Payment Delay` está presente en el CSV pero no se usa en el modelo para evitar data leakage.