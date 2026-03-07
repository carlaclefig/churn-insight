type RiskLevel = 'Bajo' | 'Medio' | 'Alto';

interface RiskBadgeProps {
  nivel: RiskLevel;
  probabilidad?: number;
}

const riskConfig: Record<RiskLevel, {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
}> = {
  Bajo: {
    bg:     'bg-green-100 dark:bg-green-900/30',
    text:   'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    dot:    'bg-green-500',
    label:  'Riesgo Bajo'
  },
  Medio: {
    bg:     'bg-yellow-100 dark:bg-yellow-900/30',
    text:   'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot:    'bg-yellow-500',
    label:  'Riesgo Medio'
  },
  Alto: {
    bg:     'bg-red-100 dark:bg-red-900/30',
    text:   'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    dot:    'bg-red-500',
    label:  'Riesgo Alto'
  },
};

export default function RiskBadge({ nivel, probabilidad }: RiskBadgeProps) {
  const style = riskConfig[nivel];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5
                      rounded-full text-sm font-semibold border
                      ${style.bg} ${style.text} ${style.border}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
      {probabilidad !== undefined && (
        <span className="opacity-75">· {probabilidad}%</span>
      )}
    </span>
  );
}