import type {
  CustomerResponseDTO,
  DashboardStats
} from '../types';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// ─── Cliente + predicción ONNX + planes ─────────────────────
export const getCustomerAnalysis = async (
  customerId: number
): Promise<CustomerResponseDTO> => {

  const response = await fetch(`${BASE_URL}/customer/${customerId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detalle || 'Cliente no encontrado');
  }

  return response.json();
};

// ─── Estadísticas del dashboard ─────────────────────────────
export const getDashboardStats = async (): Promise<DashboardStats> => {

  const response = await fetch(`${BASE_URL}/dashboard/stats`);

  if (!response.ok) {
    throw new Error('Error al cargar estadísticas del dashboard');
  }

  return response.json();
};