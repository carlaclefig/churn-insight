// ─── Entidad Cliente (viene del CSV via backend) ─────────────
export interface Customer {
  customerId: number;
  age: number;
  gender: string;
  tenure: number;
  usageFrequency: number;
  supportCalls: number;
  paymentDelay: number;
  subscriptionType: string;
  contractLength: string;
  totalSpend: number;
  lastInteraction: number;
  churn: number;
}

// ─── Resultado del modelo ONNX ───────────────────────────────
export interface AnalysisDTO {
  resultado: string;
  probabilidad: number;
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto';
}

// ─── Plan de retención generado por el LLM ───────────────────
export interface RetentionPlanDTO {
  titulo: string;
  descripcion: string;
  acciones: string[];
  prioridad: 'Alta' | 'Media' | 'Baja';
}

// ─── Respuesta completa del endpoint /api/customer/{id} ──────
export interface CustomerResponseDTO {
  cliente: Customer;
  analisis: AnalysisDTO;
  planesRetencion: RetentionPlanDTO[] | null;
  mensaje: string | null;
}

// ─── KPIs del dashboard ──────────────────────────────────────
export interface DashboardKpis {
  total_customers: number;
  evaluated_pct: number;
  churn: number;
  no_churn: number;
}

// ─── Distribución de riesgo ──────────────────────────────────
export interface RiskDistribution {
  Bajo: number;
  Medio: number;
  Alto: number;
}

// ─── Tendencia mensual ───────────────────────────────────────
export interface MonthlyTrend {
  month_bucket: string;
  churn_pct: number;
  retained_pct: number;
}

// ─── Importancia de variables ────────────────────────────────
export interface FeatureImportance {
  Variable: string;
  Importancia: number;
}

// ─── Respuesta completa del dashboard ────────────────────────
export interface DashboardStats {
  kpis: DashboardKpis;
  churn_vs_retained: {
    churned: number;
    retained: number;
  };
  risk_distribution: RiskDistribution;
  monthly_trend: MonthlyTrend[];
  feature_importance: FeatureImportance[];
}