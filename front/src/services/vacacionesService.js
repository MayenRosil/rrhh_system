import api from './api';

// Funciones para empleados
export const getMisSolicitudesVacaciones = async () => {
  try {
    const response = await api.get('/vacaciones/mis-solicitudes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getMisPeriodosVacacionales = async () => {
  try {
    const response = await api.get('/vacaciones/mis-periodos');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const solicitarVacaciones = async (vacacionesData) => {
  try {
    const response = await api.post('/vacaciones/solicitar', vacacionesData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

// Funciones para administradores
export const getSolicitudesVacaciones = async (estado) => {
  try {
    let url = '/vacaciones/solicitudes';
    if (estado) {
      url += `?estado=${estado}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getSolicitudesVacacionesByEmpleado = async (idEmpleado) => {
  try {
    const response = await api.get(`/vacaciones/empleado/${idEmpleado}/solicitudes`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getPeriodosVacacionalesByEmpleado = async (idEmpleado) => {
  try {
    const response = await api.get(`/vacaciones/empleado/${idEmpleado}/periodos`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const aprobarVacaciones = async (idVacacion) => {
  try {
    const response = await api.patch(`/vacaciones/solicitudes/${idVacacion}/aprobar`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const rechazarVacaciones = async (idVacacion, observaciones) => {
  try {
    const response = await api.patch(`/vacaciones/solicitudes/${idVacacion}/rechazar`, { observaciones });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};