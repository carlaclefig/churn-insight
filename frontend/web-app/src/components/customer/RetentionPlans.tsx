import type { RetentionPlanDTO } from '../../types';

interface RetentionPlansProps {
  planes: RetentionPlanDTO[];
  nivelRiesgo: 'Medio' | 'Alto';
}

const prioridadConfig: Record<string, { bg: string; text: string }> = {
  Alta:  { bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-700 dark:text-red-400' },
  Media: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  Baja:  { bg: 'bg-gray-100 dark:bg-gray-700',     text: 'text-gray-700 dark:text-gray-300' },
};

export default function RetentionPlans({ planes, nivelRiesgo }: RetentionPlansProps) {

  const headerColor = nivelRiesgo === 'Alto'
    ? 'text-red-600 dark:text-red-400'
    : 'text-yellow-600 dark:text-yellow-400';

  const headerLabel = nivelRiesgo === 'Alto'
    ? '🔴 Planes de Retención Intensivos'
    : '🟡 Planes de Retención Estratégicos';

  return (
    <div className="mt-6">

      <h2 className={`text-lg font-bold mb-4 ${headerColor}`}>
        {headerLabel}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planes.map((plan, index) => {
          const prioridad = prioridadConfig[plan.prioridad] || prioridadConfig['Baja'];

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl border
                         border-gray-200 dark:border-gray-700 p-5 shadow-sm
                         flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40
                                flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {plan.titulo}
                </h3>
              </div>

              <span className={`self-start text-xs font-semibold px-2.5 py-1
                                rounded-full ${prioridad.bg} ${prioridad.text}`}>
                Prioridad {plan.prioridad}
              </span>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {plan.descripcion}
              </p>

              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500
                               uppercase tracking-wider mb-2">
                  Acciones
                </p>
                <ul className="flex flex-col gap-2">
                  {plan.acciones.map((accion, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {accion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}