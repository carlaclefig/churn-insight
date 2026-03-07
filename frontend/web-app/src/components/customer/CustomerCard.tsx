import type { Customer } from '../../types';

interface CustomerCardProps {
  customer: Customer;
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center py-2.5 border-b
                  border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200
                    dark:border-gray-700 p-6 shadow-sm">

      {/* ─── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40
                        flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
            {customer.gender === 'Female' ? '♀' : '♂'}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Cliente #{customer.customerId}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {customer.gender} · {customer.age} años
          </p>
        </div>
      </div>

      {/* ─── Datos demográficos ───────────────────────────── */}
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500
                     uppercase tracking-wider mb-3">
        Perfil
      </h3>
      <div className="mb-5">
        <InfoRow label="Antigüedad"        value={`${customer.tenure} meses`} />
        <InfoRow label="Uso mensual"       value={`${customer.usageFrequency} veces`} />
        <InfoRow label="Última interacción" value={`hace ${customer.lastInteraction} días`} />
      </div>

      {/* ─── Suscripción ──────────────────────────────────── */}
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500
                     uppercase tracking-wider mb-3">
        Suscripción
      </h3>
      <div className="mb-5">
        <InfoRow label="Plan"     value={customer.subscriptionType} />
        <InfoRow label="Contrato" value={customer.contractLength} />
        <InfoRow label="Gasto total" value={`$${customer.totalSpend}`} />
      </div>

      {/* ─── Soporte ──────────────────────────────────────── */}
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500
                     uppercase tracking-wider mb-3">
        Soporte
      </h3>
      <div>
        <InfoRow label="Llamadas a soporte" value={customer.supportCalls} />
        <InfoRow label="Retraso en pagos"   value={`${customer.paymentDelay} días`} />
      </div>

    </div>
  );
}