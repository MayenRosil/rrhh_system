import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};