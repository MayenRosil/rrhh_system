import api from './api';

// Periodos de nómina
export const getPeriodos = async () => {
  try {
    const response = await api.get('/nomina/periodos');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getPeriodoById = async (id) => {
  try {
    const response = await api.get(`/nomina/periodos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const crearPeriodo = async (periodoData) => {
  try {
    const response = await api.post('/nomina/periodos', periodoData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const procesarPeriodo = async (id) => {
  try {
    const response = await api.post(`/nomina/periodos/${id}/procesar`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

// Nóminas
export const getNominasByPeriodo = async (idPeriodo) => {
  try {
    const response = await api.get(`/nomina/periodos/${idPeriodo}/nominas`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getNominaById = async (id) => {
  try {
    const response = await api.get(`/nomina/nominas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const pagarNomina = async (id, pagoData) => {
  try {
    const response = await api.patch(`/nomina/nominas/${id}/pagar`, pagoData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const calcularNominaEmpleado = async (idEmpleado, idPeriodo) => {
  try {
    const response = await api.post(`/nomina/empleados/${idEmpleado}/periodos/${idPeriodo}/calcular`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

// Historial de nóminas
export const getHistorialNominasByEmpleado = async (idEmpleado) => {
  try {
    const response = await api.get(`/nomina/empleados/${idEmpleado}/historial`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getMiHistorialNominas = async () => {
  try {
    const response = await api.get('/nomina/mi-historial');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};