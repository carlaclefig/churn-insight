import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChurnDonutChartProps {
  churned: number;
  retained: number;
}

export default function ChurnDonutChart({ churned, retained }: ChurnDonutChartProps) {

  const data = {
    labels: ['Retained', 'Churned'],
    datasets: [{
      data: [retained, churned],
      backgroundColor: ['#3b82f6', '#ef4444'],
      borderColor:     ['#2563eb', '#dc2626'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          color: '#6b7280',
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const total = churned + retained;
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400
                     uppercase tracking-wider mb-6">
        Churn vs Retained
      </h3>
      <div className="max-w-xs mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}