const db = require('../config/database');
const moment = require('moment');

class MarcajeModel {
  // Método para registrar entrada
  async registrarEntrada(idEmpleado) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_registrar_entrada(?, @id_marcaje, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idEmpleado
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @id_marcaje as marcaje, @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Marcado exitosamente',
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
    console.error('Error al marcar:', error);
    return {
      success: false,
      message: 'Error al marcar',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para registrar salida
  async registrarSalida(idEmpleado) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_registrar_salida(?, @id_marcaje, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idEmpleado
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @id_marcaje as marcaje, @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Marcado exitosamente',
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
    console.error('Error al marcar:', error);
    return {
      success: false,
      message: 'Error al marcar',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para obtener los marcajes de un empleado
  async getMarcajesByEmpleado(idEmpleado, fechaInicio, fechaFin) {
    try {
      const marcajes = await db.query(`
        SELECT 
          m.id_marcaje,
          m.fecha,
          m.hora_entrada,
          m.hora_salida,
          m.horas_trabajadas,
          m.observaciones,
          m.estado
        FROM marcajes m
        WHERE m.id_empleado = ?
        AND m.fecha BETWEEN ? AND ?
        ORDER BY m.fecha DESC, m.hora_entrada DESC
      `, [idEmpleado, fechaInicio, fechaFin]);
      
      return marcajes;
    } catch (error) {
      console.error('Error al obtener marcajes:', error);
      throw error;
    }
  }
  
  // Método para obtener los marcajes de todos los empleados
  async getAllMarcajes(fechaInicio, fechaFin) {
    try {
      const marcajes = await db.query(`
        SELECT 
          m.id_marcaje,
          m.fecha,
          m.hora_entrada,
          m.hora_salida,
          m.horas_trabajadas,
          m.observaciones,
          m.estado,
          e.id_empleado,
          e.codigo_empleado,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado
        FROM marcajes m
        JOIN empleados e ON m.id_empleado = e.id_empleado
        WHERE m.fecha BETWEEN ? AND ?
        ORDER BY m.fecha DESC, m.hora_entrada DESC
      `, [fechaInicio, fechaFin]);
      
      return marcajes;
    } catch (error) {
      console.error('Error al obtener todos los marcajes:', error);
      throw error;
    }
  }
  
  // Método para actualizar el estado de un marcaje
  async updateEstado(idMarcaje, estado, observaciones) {
    try {
      const result = await db.query(`
        UPDATE marcajes
        SET 
          estado = ?,
          observaciones = ?
        WHERE id_marcaje = ?
      `, [estado, observaciones, idMarcaje]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Marcaje actualizado correctamente' : 'No se pudo actualizar el marcaje'
      };
    } catch (error) {
      console.error('Error al actualizar estado de marcaje:', error);
      throw error;
    }
  }
}

module.exports = new MarcajeModel();