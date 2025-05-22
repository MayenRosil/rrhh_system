import api from './api';

export const getAllLiquidaciones = async () => {
  try {
    const response = await api.get('/liquidaciones');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getLiquidacionById = async (id) => {
  try {
    const response = await api.get(`/liquidaciones/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const calcularLiquidacion = async (liquidacionData) => {
  try {
    const response = await api.post('/liquidaciones', liquidacionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const pagarLiquidacion = async (id, pagoData) => {
  try {
    const response = await api.patch(`/liquidaciones/${id}/pagar`, pagoData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};