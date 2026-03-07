import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { MonthlyTrend } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement,LineElement, Tooltip, Legend, Filler);

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {

  const labels    = data.map(d => d.month_bucket);
  const churnData    = data.map(d => d.churn_pct);
  const retainedData = data.map(d => d.retained_pct);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Churn %',
        data: churnData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.08)',
        pointBackgroundColor: '#ef4444',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Retained %',
        data: retainedData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.08)',
        pointBackgroundColor: '#22c55e',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          color: '#6b7280',
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(107,114,128,0.1)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(107,114,128,0.1)' },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          callback: (val: any) => `${val}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400
                     uppercase tracking-wider mb-6">
        Monthly Churn Trend
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
}