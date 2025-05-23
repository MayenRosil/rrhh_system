const db = require('../config/database');
const bcrypt = require('bcrypt');

class AuthModel {
  // Método para validar credenciales
  async login(email, password) {
    try {
      // Buscar el empleado por email
      const usuarios = await db.query(
        'SELECT id_empleado, codigo_empleado, nombre, apellido, email, password, id_rol, estado FROM empleados WHERE email = ?',
        [email]
      );

      if (usuarios.length === 0) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      const usuario = usuarios[0];

      // Verificar el estado del usuario
      if (usuario.estado !== 'ACTIVO') {
        return {
          success: false,
          message: 'Usuario inactivo'
        };
      }

      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, usuario.password);

      if (!passwordMatch) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }



      // Obtener el nombre del rol
      const roles = await db.query(
        'SELECT nombre FROM roles WHERE id_rol = ?',
        [usuario.id_rol]
      );


      // Preparar los datos del usuario (sin incluir la contraseña)
      const userData = {
        id: usuario.id_empleado,
        codigo: usuario.codigo_empleado,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: roles[0].nombre
      };

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Método para cambiar contraseña
  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Buscar el empleado por ID
      const usuarios = await db.query(
        'SELECT password FROM empleados WHERE id_empleado = ?',
        [userId]
      );

      if (usuarios.length === 0) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      const usuario = usuarios[0];

      // Verificar la contraseña actual
      const passwordMatch = await bcrypt.compare(oldPassword, usuario.password);

      if (!passwordMatch) {
        return {
          success: false,
          message: 'La contraseña actual es incorrecta'
        };
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña
      await db.query(
        'UPDATE empleados SET password = ? WHERE id_empleado = ?',
        [hashedPassword, userId]
      );

      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }

  async getAllRoles() {
    try {
      const roles = await db.query(`
        SELECT r.id_rol, r.nombre, r.descripcion, r.activo
        FROM roles r
        ORDER BY r.id_rol ASC
      `);

      return roles;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }
}

module.exports = new AuthModel();