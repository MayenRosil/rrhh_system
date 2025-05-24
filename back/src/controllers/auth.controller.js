const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');
const empleadoModel = require('../models/empleado.model');
const dotenv = require('dotenv');

dotenv.config();

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere email y contraseña'
        });
      }
      
      const loginResult = await authModel.login(email, password);
      
      if (!loginResult.success) {
        return res.status(401).json(loginResult);
      }
      
      const token = jwt.sign(
        { id: loginResult.user.id, rol: loginResult.user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return res.status(200).json({
        success: true,
        token,
        user: loginResult.user
      });
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }
  
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const usuario = await empleadoModel.getById(userId);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      delete usuario.password;
      
      return res.status(200).json({
        success: true,
        user: usuario
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener información del perfil',
        error: error.message
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere la contraseña actual y la nueva contraseña'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await authModel.changePassword(userId, oldPassword, newPassword);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al cambiar la contraseña',
        error: error.message
      });
    }
  }

    async getRoles(req, res) {
    try {
      const roles = await authModel.getAllRoles();
      
      return res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Error al obtener roles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la lista de roles',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();