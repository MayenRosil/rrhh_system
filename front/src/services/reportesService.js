import api from './api';

export const getReporteNominaPeriodo = async (idPeriodo) => {
  try {
    const response = await api.get(`/reportes/nomina/periodo/${idPeriodo}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getReporteMarcajesDepartamento = async (idDepartamento, fechaInicio, fechaFin) => {
  try {
    let url = `/reportes/marcajes/departamento/${idDepartamento}`;
    const params = [];
    
    if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
    if (fechaFin) params.push(`fechaFin=${fechaFin}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getReporteVacacionesDepartamento = async (idDepartamento, fechaInicio, fechaFin, estado) => {
  try {
    let url = `/reportes/vacaciones/departamento/${idDepartamento}`;
    const params = [];
    
    if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
    if (fechaFin) params.push(`fechaFin=${fechaFin}`);
    if (estado) params.push(`estado=${estado}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};