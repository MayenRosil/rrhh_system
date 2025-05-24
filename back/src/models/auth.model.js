const db = require('../config/database');
const bcrypt = require('bcrypt');

class AuthModel {
  // Método para validar credenciales
async login(email, password) {
  try {
    const conn = await db.pool.getConnection();

    try {
      // Ejecutar SP para obtener empleado por email
      await conn.query('CALL sp_login_empleado(?, @id_empleado, @codigo_empleado, @nombre, @apellido, @password, @id_rol, @estado, @resultado, @mensaje)', [email]);

      // Obtener resultados del SP
      const [usuarioRows] = await conn.query('SELECT @id_empleado AS id_empleado, @codigo_empleado AS codigo_empleado, @nombre AS nombre, @apellido AS apellido, @password AS password, @id_rol AS id_rol, @estado AS estado, @resultado AS resultado, @mensaje AS mensaje');

      const usuario = usuarioRows[0];

      if (!usuario.resultado) {
        return {
          success: false,
          message: usuario.mensaje
        };
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, usuario.password);

      if (!passwordMatch) {
        return {
          success: false,
          message: 'Credenciales inválidas'
        };
      }

      // Obtener nombre del rol
      await conn.query('CALL sp_obtener_nombre_rol(?, @nombre_rol, @rol_resultado, @rol_mensaje)', [usuario.id_rol]);
      
      const [rolRows] = await conn.query('SELECT @nombre_rol AS nombre_rol, @rol_resultado AS resultado, @rol_mensaje AS mensaje');

      if (!rolRows[0].resultado) {
        return {
          success: false,
          message: rolRows[0].mensaje
        };
      }

      // Preparar los datos del usuario
      const userData = {
        id: usuario.id_empleado,
        codigo: usuario.codigo_empleado,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: email,
        rol: rolRows[0].nombre_rol
      };

      return {
        success: true,
        user: userData
      };

    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return {
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message || 'Error interno del servidor'
    };
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