import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerAnalysis } from '../services/api';
import type { CustomerResponseDTO } from '../types';
import CustomerCard from '../components/customer/CustomerCard';
import AnalysisCard from '../components/customer/AnalysisCard';
import RetentionPlans from '../components/customer/RetentionPlans';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeftIcon } from '../components/ui/icons';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData]       = useState<CustomerResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getCustomerAnalysis(Number(id));
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ─── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <LoadingSpinner message="Analizando cliente con modelo ONNX..." />
    );
  }

  // ─── Error ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30
                        flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Cliente no encontrado
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold rounded-xl transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const nivelRiesgo = data.analisis.nivelRiesgo;

  return (
    <div className="max-w-6xl mx-auto">

      {/* ─── Breadcrumb ──────────────────────────────────── */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500
                   dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                   transition-colors duration-200 mb-6"
      >
        <ArrowLeftIcon />
        Volver al buscador
      </button>

      {/* ─── Título ──────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Detalle del Cliente #{id}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Análisis predictivo generado por modelo ONNX
        </p>
      </div>

      {/* ─── Grid principal ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerCard customer={data.cliente} />
        <AnalysisCard
          analisis={data.analisis}
          mensaje={data.mensaje}
        />
      </div>

      {/* ─── Planes de retención (solo Medio y Alto) ─────── */}
      {(nivelRiesgo === 'Medio' || nivelRiesgo === 'Alto') && (
        <>
          {data.planesRetencion && data.planesRetencion.length > 0 ? (
            <RetentionPlans
              planes={data.planesRetencion}
              nivelRiesgo={nivelRiesgo as 'Medio' | 'Alto'}
            />
          ) : (
            <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20
                            border border-yellow-200 dark:border-yellow-800
                            rounded-2xl">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ {data.mensaje ?? 'En este momento no se puede generar un plan de retención.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}