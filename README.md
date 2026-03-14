# Churn Insight 🔍

Plataforma empresarial de predicción de abandono de clientes construida con Spring Boot, React y machine learning.

## Descripción

Churn Insight permite buscar un cliente por ID, analizar su perfil mediante un modelo ONNX y clasificar su riesgo de abandono en Bajo, Medio o Alto. Para clientes en riesgo, genera planes de retención personalizados usando IA generativa (Claude).

## Arquitectura
```
churn-insight/
├── backend/springboot-app    → API REST (Spring Boot 3 + ONNX Runtime)
├── frontend/web-app          → UI (React + TypeScript + Tailwind CSS)
├── data-science/             → Notebook, dataset y modelo entrenado
└── docker-compose.yml        → Orquestación de servicios
```

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Spring Boot 3, Java 17, ONNX Runtime 1.18 |
| Frontend | React 18, TypeScript, Tailwind CSS 3, Chart.js |
| ML | Random Forest, scikit-learn, ONNX |
| IA Generativa | Claude (Anthropic API) |
| DevOps | Docker, Docker Compose |

## Funcionalidades

- Búsqueda de cliente por ID
- Predicción de churn con modelo ONNX
- Clasificación de riesgo: Bajo / Medio / Alto
- Planes de retención generados por LLM (solo Medio y Alto)
- Dashboard analítico con 4 gráficos
- Dark Mode / Light Mode persistente
- Diseño responsive mobile-first

## Requisitos

- Docker y Docker Compose
- API key de Anthropic (console.anthropic.com)

## Instalación y uso

### Con Docker (recomendado)

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/churn-insight.git
cd churn-insight
```

2. Crea el archivo `.env` en la raíz:
```bash
ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui
```

3. Levanta los servicios:
```bash
docker-compose up --build
```

4. Accede a la aplicación:
```
Frontend → http://localhost:3000
Backend  → http://localhost:8080
```

### Sin Docker (desarrollo local)

**Backend:**
```bash
cd backend/springboot-app
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edita application.properties con tu API key
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend/web-app
npm install
npm run dev
```

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `ANTHROPIC_API_KEY` | API key de Claude | ✅ |
| `VITE_API_URL` | URL del backend | Solo en producción |

## Modelo de ML

- Algoritmo: Random Forest (100 árboles)
- Precisión: 78.26%
- Recall churn: 89.54%
- Features: 11 variables de comportamiento
- Formato: ONNX

## Clasificación de riesgo

| Probabilidad | Nivel | Acción |
|---|---|---|
| 0 – 30% | 🟢 Bajo | Sin intervención |
| 31 – 60% | 🟡 Medio | 3 planes estratégicos |
| 61 – 100% | 🔴 Alto | 3 planes intensivos |