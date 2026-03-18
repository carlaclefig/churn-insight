import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../components/ui/icons';

export default function Home() {
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const id = parseInt(customerId.trim());

    if (!customerId.trim()) {
      setError('Por favor ingresa un ID de cliente.');
      return;
    }

    if (isNaN(id) || id <= 0) {
      setError('El ID debe ser un número válido mayor a 0.');
      return;
    }

    setError('');
    navigate(`/customer/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      {/* ─── Hero ────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16
                        bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/30">
          <span className="text-white text-2xl font-bold">CI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900
                       dark:text-white mb-4 tracking-tight">
          Churn<span className="text-blue-600">Insight</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Predice el abandono de clientes y genera estrategias de retención personalizadas con IA.
        </p>
      </div>

      {/* ─── Buscador ────────────────────────────────────── */}
      <div className="w-full max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center
                            pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="number"
              value={customerId}
              onChange={e => {
                setCustomerId(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="ID del cliente (ej: 1042)"
              min={1}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all duration-200
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white font-semibold rounded-xl transition-colors
                       duration-200 shadow-md shadow-blue-600/20
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-center">
            {error}
          </p>
        )}

        {/* Hint */}
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
          IDs disponibles: 1 – 64,374
        </p>
      </div>

      {/* ─── Stats rápidas ───────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mt-14 w-full max-w-md">
        {[
          { label: 'Clientes',    value: '64,374' },
          { label: 'Recall',      value: '89.54%'   },
          { label: 'Precisión',   value: '78.26%' },
        ].map(stat => (
          <div key={stat.label}
            className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl
                       border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}