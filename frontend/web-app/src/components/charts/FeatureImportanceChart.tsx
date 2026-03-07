import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { FeatureImportance } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

export default function FeatureImportanceChart({ data }: FeatureImportanceChartProps) {

  const sorted = [...data].sort((a, b) => b.Importancia - a.Importancia);

  const chartData = {
    labels: sorted.map(d => d.Variable),
    datasets: [{
      label: 'Importancia',
      data: sorted.map(d => d.Importancia),
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` Importancia: ${(ctx.raw * 100).toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 1,
        grid: { color: 'rgba(107,114,128,0.1)' },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          callback: (val: any) => val.toFixed(1),
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400
                     uppercase tracking-wider mb-6">
        Most Influential Variables
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}