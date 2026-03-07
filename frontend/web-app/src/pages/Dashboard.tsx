import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ChurnDonutChart from '../components/charts/ChurnDonutChart';
import RiskBarChart from '../components/charts/RiskBarChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
}

const KpiCard = ({ title, value, subtitle, icon, color }: KpiCardProps) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                  dark:border-gray-700 p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando estadísticas..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const { kpis, churn_vs_retained, risk_distribution,
          monthly_trend, feature_importance } = stats;

  return (
    <div className="max-w-6xl mx-auto">

      {/* ─── Header ──────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Estadísticas históricas del dataset de clientes
        </p>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Customers"
          value={kpis.total_customers.toLocaleString()}
          icon="👥"
          color="text-gray-900 dark:text-white"
        />
        <KpiCard
          title="Evaluated"
          value={`${kpis.evaluated_pct}%`}
          icon="✅"
          color="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Churn Rate"
          value={`${kpis.churn}%`}
          subtitle="Tasa histórica"
          icon="📉"
          color="text-red-600 dark:text-red-400"
        />
        <KpiCard
          title="No Churn"
          value={`${kpis.no_churn}%`}
          subtitle="Clientes retenidos"
          icon="🛡️"
          color="text-green-600 dark:text-green-400"
        />
      </div>

      {/* ─── Fila 1: Donut + Risk Bar ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChurnDonutChart
          churned={churn_vs_retained.churned}
          retained={churn_vs_retained.retained}
        />
        <RiskBarChart
          bajo={risk_distribution.Bajo}
          medio={risk_distribution.Medio}
          alto={risk_distribution.Alto}
        />
      </div>

      {/* ─── Fila 2: Trend + Feature Importance ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart data={monthly_trend} />
        <FeatureImportanceChart data={feature_importance} />
      </div>

    </div>
  );
}