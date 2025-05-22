import api from './api';

export const getAllEmpleados = async () => {
  try {
    const response = await api.get('/empleados');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getEmpleadoById = async (id) => {
  try {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const createEmpleado = async (empleadoData) => {
  try {
    const response = await api.post('/empleados', empleadoData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const updateEmpleado = async (id, empleadoData) => {
  try {
    const response = await api.put(`/empleados/${id}`, empleadoData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const updateSalario = async (id, salarioData) => {
  try {
    const response = await api.patch(`/empleados/${id}/salario`, salarioData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const darDeBaja = async (id, bajaData) => {
  try {
    const response = await api.patch(`/empleados/${id}/baja`, bajaData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getHistorialSalarios = async (id) => {
  try {
    const response = await api.get(`/empleados/${id}/historial-salarios`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};