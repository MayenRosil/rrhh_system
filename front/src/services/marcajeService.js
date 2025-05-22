import api from './api';

export const registrarEntrada = async () => {
  try {
    const response = await api.post('/marcajes/entrada');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const registrarSalida = async () => {
  try {
    const response = await api.post('/marcajes/salida');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getMisMarcajes = async (fechaInicio, fechaFin) => {
  try {
    let url = '/marcajes/mis-marcajes';
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else if (fechaInicio) {
      url += `?fechaInicio=${fechaInicio}`;
    } else if (fechaFin) {
      url += `?fechaFin=${fechaFin}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getAllMarcajes = async (fechaInicio, fechaFin) => {
  try {
    let url = '/marcajes';
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else if (fechaInicio) {
      url += `?fechaInicio=${fechaInicio}`;
    } else if (fechaFin) {
      url += `?fechaFin=${fechaFin}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getMarcajesByEmpleado = async (idEmpleado, fechaInicio, fechaFin) => {
  try {
    let url = `/marcajes/empleado/${idEmpleado}`;
    if (fechaInicio && fechaFin) {
      url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else if (fechaInicio) {
      url += `?fechaInicio=${fechaInicio}`;
    } else if (fechaFin) {
      url += `?fechaFin=${fechaFin}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const updateEstadoMarcaje = async (id, estado, observaciones) => {
  try {
    const response = await api.patch(`/marcajes/${id}/estado`, { estado, observaciones });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};