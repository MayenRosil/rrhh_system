import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Cambiado aquí
import { login as loginService, getProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verificar si el token está expirado
          const decodedToken = jwtDecode(token); // Cambiado aquí
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expirado
            logout();
          } else {
            // Obtener información del usuario
            const response = await getProfile();
            if (response.success) {
              setUser(response.user);
            } else {
              logout();
            }
          }
        } catch (error) {
          console.error('Error al inicializar la autenticación:', error);
          logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, [token]);
  
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
        return { success: true };
      } else {
        setError(response.message || 'Error de autenticación');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de autenticación';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const isAdmin = () => {
    return user && user.rol === 'Administrador';
  };
  
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAdmin
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};