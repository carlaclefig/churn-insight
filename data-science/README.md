# Data Science — Churn Insight

Módulo de análisis y modelado predictivo de abandono de clientes (churn). Contiene el dataset, el notebook de exploración y entrenamiento, y el modelo exportado listo para ser consumido por el backend.

## Estructura

```
data-science/
├── dataset/
│   ├── customer_churn_dataset.csv   # Dataset original (64,374 registros)
│   ├── feature_importance.csv       # Importancia de variables exportada
│   └── dashboard_stats.json         # Métricas agregadas para el dashboard
├── model/
│   └── modelo_churn_final.onnx      # Modelo entrenado en formato ONNX
└── notebooks/
    └── churn.ipynb                  # Notebook principal: EDA, entrenamiento y exportación
```

## Dataset

**Archivo:** `dataset/customer_churn_dataset.csv`
**Registros:** 64,374 clientes | **Sin valores nulos ni duplicados**

| Variable | Tipo | Descripción |
|---|---|---|
| `Age` | int | Edad del cliente (años) |
| `Gender` | object | Género del cliente (Female / Male) |
| `Tenure` | int | Tiempo como cliente (meses) |
| `Usage Frequency` | int | Frecuencia de uso del servicio (veces/mes) |
| `Support Calls` | int | Llamadas al servicio de atención |
| `Payment Delay` | int | Retraso en pagos (meses) — **excluida del modelo** |
| `Subscription Type` | object | Tipo de suscripción (Basic / Standard / Premium) |
| `Contract Length` | object | Duración del contrato (Monthly / Quarterly / Annual) |
| `Total Spend` | int | Gasto total acumulado (USD) |
| `Last Interaction` | int | Meses desde la última interacción |
| `Churn` | int | Variable objetivo: 0 = se queda, 1 = se va |

## Metodología

### 1. Preprocesamiento
- Se eliminó `CustomerID` por ser un identificador sin valor predictivo.
- Se verificó la ausencia de nulos y duplicados.
- Codificación de variables categóricas:
  - `Gender`: Female → 0, Male → 1
  - `Subscription Type`: Basic → 1, Standard → 2, Premium → 3
  - `Contract Length`: Monthly → 1, Quarterly → 3, Annual → 12

### 2. Análisis Exploratorio (EDA)
Hallazgos principales:
- **47.4%** de los clientes presentan churn.
- Los clientes con **contratos mensuales** tienen mayor tasa de abandono que los anuales o trimestrales.
- Mayor número de **llamadas a soporte** está asociado directamente con mayor probabilidad de churn.

### 3. Ingeniería de Features
Se crearon dos variables derivadas para mejorar el poder predictivo:

| Feature | Fórmula | Descripción |
|---|---|---|
| `Support_Urgency` | `Support Calls / (Tenure + 1)` | Llamadas por mes de antigüedad |
| `Monthly_Spend` | `Total Spend / (Tenure + 1)` | Gasto promedio mensual |

### 4. Detección de Data Leakage
El primer modelo entrenado con todas las variables alcanzó **99.83% de precisión**, debido a que `Payment Delay` actúa como una regla administrativa directa (si el cliente no paga, ya se fue). Esta variable se eliminó para construir un **modelo preventivo**, capaz de detectar el riesgo antes de que ocurra el impago.

### 5. Modelo Final

- **Algoritmo:** Random Forest Classifier (100 árboles)
- **Split:** 80% entrenamiento / 20% prueba (estratificado)
- **Features de entrada (11):**
  ```
  Age, Gender, Tenure, Usage Frequency, Support Calls,
  Subscription Type, Contract Length, Total Spend,
  Last Interaction, Support_Urgency, Monthly_Spend
  ```

## Resultados

| Métrica | Valor |
|---|---|
| Precisión general | 78.26% |
| Recall (clase Churn) | **89.54%** |
| F1-score (clase Churn) | 0.80 |

El recall alto en churn es el resultado deseado: el modelo prioriza detectar clientes en riesgo aunque genere algunos falsos positivos, lo cual es preferible en contextos de retención.

## Importancia de Variables

| Ranking | Variable | Importancia |
|---|---|---|
| 1 | Support_Urgency | 12.57% |
| 2 | Usage Frequency | 11.54% |
| 3 | Tenure | 11.44% |
| 4 | Support Calls | 11.29% |
| 5 | Monthly_Spend | 11.25% |
| 6 | Total Spend | 11.14% |
| 7 | Age | 9.31% |
| 8 | Gender | 7.68% |
| 9 | Last Interaction | 6.77% |
| 10 | Contract Length | 4.69% |
| 11 | Subscription Type | 2.33% |

## Outputs Generados

| Archivo | Descripción |
|---|---|
| `model/modelo_churn_final.onnx` | Modelo exportado para ser consumido por el backend Java |
| `dataset/feature_importance.csv` | Ranking de importancia de variables |
| `dataset/dashboard_stats.json` | KPIs, distribución de riesgo y tendencia mensual para el dashboard |

## Requisitos

```
pandas
scikit-learn
seaborn
matplotlib
skl2onnx
onnxruntime
```
