import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface RiskBarChartProps {
  bajo: number;
  medio: number;
  alto: number;
}

export default function RiskBarChart({ bajo, medio, alto }: RiskBarChartProps) {

  const data = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      label: 'Clientes',
      data: [bajo, medio, alto],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderColor:     ['#16a34a', '#ca8a04', '#dc2626'],
      borderWidth: 2,
      borderRadius: 6,
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
            ` ${ctx.raw.toLocaleString()} clientes`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(107,114,128,0.1)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400
                     uppercase tracking-wider mb-6">
        Risk Level Distribution
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}