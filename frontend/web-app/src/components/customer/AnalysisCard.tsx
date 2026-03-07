import type { AnalysisDTO } from '../../types';
import RiskBadge from '../ui/RiskBadge';

interface AnalysisCardProps {
  analisis: AnalysisDTO;
  mensaje: string | null;
}

export default function AnalysisCard({ analisis, mensaje }: AnalysisCardProps) {

  const barColor = {
    Bajo:  'bg-green-500',
    Medio: 'bg-yellow-500',
    Alto:  'bg-red-500',
  }[analisis.nivelRiesgo];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">

      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        Análisis de Riesgo
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Resultado del modelo predictivo ONNX
      </p>

      <div className="mb-6">
        <RiskBadge
          nivel={analisis.nivelRiesgo}
          probabilidad={analisis.probabilidad}
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Probabilidad de abandono
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {analisis.probabilidad}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${analisis.probabilidad}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">0%</span>
          <span className="text-xs text-gray-400">100%</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Predicción:
          <span className="ml-2 text-gray-900 dark:text-white font-semibold">
            {analisis.resultado}
          </span>
        </p>
      </div>

      {mensaje && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20
                        border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400">
            ✅ {mensaje}
          </p>
        </div>
      )}

    </div>
  );
}