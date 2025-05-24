const db = require('../config/database');

class VacacionesModel {
  // Método para solicitar vacaciones
  async solicitarVacaciones(vacacionesData) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_solicitar_vacaciones(?, ?, ?,?, @id_vacacion, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        vacacionesData.id_empleado,
        vacacionesData.fecha_inicio,
        vacacionesData.fecha_fin,
        vacacionesData.observaciones,
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @id_vacacion as vacacion, @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Vacacion solicitada exitosamente',
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
    console.error('Error al solicitar vacaciones:', error);
    return {
      success: false,
      message: 'Error al solicitar vacaciones',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para aprobar vacaciones
  async aprobarVacaciones(idVacacion) {
   try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_aprobar_vacaciones(?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idVacacion
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Vacacion aprobada exitosamente',
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
    console.error('Error al aprobar vacaciones:', error);
    return {
      success: false,
      message: 'Error al aprobar vacaciones',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para rechazar vacaciones
  async rechazarVacaciones(idVacacion, observaciones) {
    try {
      const result = await db.query(`
        UPDATE vacaciones
        SET 
          estado = 'RECHAZADO',
          observaciones = ?
        WHERE id_vacacion = ?
      `, [observaciones, idVacacion]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Vacaciones rechazadas correctamente' : 'No se pudieron rechazar las vacaciones'
      };
    } catch (error) {
      console.error('Error al rechazar vacaciones:', error);
      throw error;
    }
  }
  
  // Método para obtener las solicitudes de vacaciones
  async getSolicitudesVacaciones(estado = null) {
    try {
      let query = `
        SELECT 
          v.id_vacacion,
          v.id_empleado,
          e.codigo_empleado,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
          v.fecha_inicio,
          v.fecha_fin,
          v.dias_tomados,
          v.estado,
          v.observaciones,
          v.fecha_creacion
        FROM vacaciones v
        JOIN empleados e ON v.id_empleado = e.id_empleado
        ORDER BY v.id_vacacion DESC
      `;
      
      const params = [];
      
      if (estado) {
        query += ' WHERE v.estado = ?';
        params.push(estado);
      }
      
      query += ' ORDER BY v.fecha_creacion DESC';
      
      const solicitudes = await db.query(query, params);
      
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener solicitudes de vacaciones:', error);
      throw error;
    }
  }
  
  // Método para obtener las solicitudes de vacaciones de un empleado
  async getSolicitudesVacacionesByEmpleado(idEmpleado) {
    try {
      const solicitudes = await db.query(`
        SELECT 
          v.id_vacacion,
          v.fecha_inicio,
          v.fecha_fin,
          v.dias_tomados,
          v.estado,
          v.observaciones,
          v.fecha_creacion
        FROM vacaciones v
        WHERE v.id_empleado = ?
        ORDER BY v.id_vacacion DESC
      `, [idEmpleado]);
      
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener solicitudes de vacaciones por empleado:', error);
      throw error;
    }
  }
  
  // Método para obtener los períodos vacacionales de un empleado
  async getPeriodosVacacionalesByEmpleado(idEmpleado) {
    try {
      const periodos = await db.query(`
        SELECT 
          id_periodo_vacacional,
          fecha_inicio,
          fecha_fin,
          dias_correspondientes,
          dias_tomados,
          dias_pendientes,
          estado
        FROM periodos_vacacionales
        WHERE id_empleado = ?
        ORDER BY fecha_inicio DESC
      `, [idEmpleado]);
      
      return periodos;
    } catch (error) {
      console.error('Error al obtener períodos vacacionales:', error);
      throw error;
    }
  }
}

module.exports = new VacacionesModel();