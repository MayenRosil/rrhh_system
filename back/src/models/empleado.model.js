const db = require('../config/database');
const bcrypt = require('bcrypt');

class EmpleadoModel {
  // Método para obtener todos los empleados
async getAll() {
  try {
    const conn = await db.pool.getConnection();

    try {
      const [empleados] = await conn.query('CALL sp_obtener_todos_empleados(@p_resultado, @p_mensaje)');
      const [output] = await conn.query('SELECT @p_resultado AS resultado, @p_mensaje AS mensaje');

      if (!output[0].resultado) {
        console.error(output[0].mensaje);
        return [];
      }

      return empleados[0];
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
}
  
  // Método para obtener un empleado por ID
  async getById(id) {
    try {
      const empleados = await db.query(`
        SELECT e.id_empleado, e.codigo_empleado, e.nombre, e.apellido, 
               e.dpi, e.fecha_nacimiento, e.direccion, e.telefono, 
               e.email, e.id_puesto, e.id_rol, e.fecha_contratacion, 
               e.fecha_fin_contrato, e.estado, e.salario_actual, 
               p.nombre AS puesto, d.nombre AS departamento, d.id_departamento AS id_departamento, 
               r.nombre AS rol
        FROM empleados e
        JOIN puestos p ON e.id_puesto = p.id_puesto
        JOIN departamentos d ON p.id_departamento = d.id_departamento
        JOIN roles r ON e.id_rol = r.id_rol
        WHERE e.id_empleado = ?
      `, [id]);
      
      return empleados.length ? empleados[0] : null;
    } catch (error) {
      console.error('Error al obtener empleado por ID:', error);
      throw error;
    }
  }
  
// Método para crear un nuevo empleado
async create(empleadoData) {
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(empleadoData.password, 10);
    
    console.log('Creando empleado:', empleadoData);
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
      // Ejecutar el procedimiento almacenado con los parámetros de salida
      const query = `
        CALL sp_crear_empleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        empleadoData.codigo_empleado,
        empleadoData.nombre,
        empleadoData.apellido,
        empleadoData.dpi,
        empleadoData.fecha_nacimiento,
        empleadoData.direccion,
        empleadoData.telefono,
        empleadoData.email,
        Number(empleadoData.id_puesto),
        Number(empleadoData.id_rol),
        empleadoData.fecha_contratacion,
        empleadoData.salario_actual,
        //empleadoData.tipo_pago,
        hashedPassword
      ]);
      
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Empleado creado exitosamente',
          id: rows[0].resultado > 0 ? rows[0].resultado : null
        };
      } else {
        return {
          success: false,
          message: 'No se pudo obtener la respuesta del servidor',
          id: null
        };
      }
    } finally {
      // Liberar la conexión al pool
      conn.release();
    }
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return {
      success: false,
      message: 'Error al crear el empleado',
      error: error.message || 'Error interno del servidor'
    };
  }
}
  
  // Método para actualizar un empleado
  async update(id, empleadoData) {
  try {
    
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_actualizar_empleado(?, ?, ?, ?, ?, ?, ?, ?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        id,
        empleadoData.nombre,
        empleadoData.apellido,
        empleadoData.direccion,
        empleadoData.telefono,
        empleadoData.email,
        empleadoData.id_puesto,
        empleadoData.id_rol,
        //empleadoData.tipo_pago,
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Empleado creado exitosamente',
          id: rows[0].resultado > 0 ? rows[0].resultado : null
        };
      } else {
        return {
          success: false,
          message: 'No se pudo obtener la respuesta del servidor',
          id: null
        };
      }
    } finally {
      // Liberar la conexión al pool
      conn.release();
    }
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    return {
      success: false,
      message: 'Error al actualizar el empleado',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para actualizar el salario de un empleado
  async updateSalario(id, salarioData) {
    try {
      // Llamar al procedimiento almacenado
      const result = await db.callProcedure('sp_actualizar_salario', [
        id,
        salarioData.salario_nuevo,
        salarioData.motivo,
        salarioData.id_usuario_modificacion,
        '@resultado',
        '@mensaje'
      ]);
      
      // Obtener los parámetros de salida
      const outParams = await db.query('SELECT @resultado as resultado, @mensaje as mensaje');
      
      return {
        success: outParams[0].resultado,
        message: outParams[0].mensaje
      };
    } catch (error) {
      console.error('Error al actualizar salario:', error);
      throw error;
    }
  }
  
  // Método para dar de baja a un empleado
  async darDeBaja(id, bajaData) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_baja_empleado(?, ?, ?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        id,
        bajaData.fecha_fin,
        bajaData.motivo,
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Empleado dado de baja exitosamente',
          id: rows[0].resultado > 0 ? rows[0].resultado : null
        };
      } else {
        return {
          success: false,
          message: 'No se pudo obtener la respuesta del servidor',
          id: null
        };
      }
    } finally {
      // Liberar la conexión al pool
      conn.release();
    }
  } catch (error) {
    console.error('Error al dar de baja empleado:', error);
    return {
      success: false,
      message: 'Error al dar de baja el empleado',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para obtener el historial de salarios de un empleado
  async getHistorialSalarios(id) {
    try {
      const historial = await db.query(`
        SELECT 
          hs.id_historico_salario,
          hs.salario_anterior,
          hs.salario_nuevo,
          hs.fecha_cambio,
          hs.motivo,
          CONCAT(e.nombre, ' ', e.apellido) AS usuario_modificacion
        FROM historico_salarios hs
        LEFT JOIN empleados e ON hs.id_usuario_modificacion = e.id_empleado
        WHERE hs.id_empleado = ?
        ORDER BY hs.fecha_cambio DESC
      `, [id]);
      
      return historial;
    } catch (error) {
      console.error('Error al obtener historial de salarios:', error);
      throw error;
    }
  }
}

module.exports = new EmpleadoModel();