const db = require('../config/database');
const moment = require('moment');

class NominaModel {
  // Método para crear un período de nómina
  async crearPeriodo(periodoData) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_crear_periodo_nomina(?, ?, ?, @id_periodo, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        periodoData.tipo,
        periodoData.fecha_inicio,
        periodoData.fecha_fin,
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Periodo de nomina creado exitosamente',
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
    console.error('Error al crear Periodo de nomina creado :', error);
    return {
      success: false,
      message: 'Error al crear Periodo de nomina creado ',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para obtener todos los períodos de nómina
  async getPeriodos() {
    try {
      const periodos = await db.query(`
        SELECT 
          id_periodo,
          tipo,
          fecha_inicio,
          fecha_fin,
          estado,
          fecha_creacion
        FROM periodos_nomina
        ORDER BY id_periodo DESC
      `);
      
      return periodos;
    } catch (error) {
      console.error('Error al obtener períodos de nómina:', error);
      throw error;
    }
  }
  
  // Método para obtener un período de nómina por ID
  async getPeriodoById(idPeriodo) {
    try {
      const periodos = await db.query(`
        SELECT 
          id_periodo,
          tipo,
          fecha_inicio,
          fecha_fin,
          estado,
          fecha_creacion
        FROM periodos_nomina
        WHERE id_periodo = ?
      `, [idPeriodo]);
      
      return periodos.length ? periodos[0] : null;
    } catch (error) {
      console.error('Error al obtener período de nómina por ID:', error);
      throw error;
    }
  }
  
  // Método para procesar un período de nómina
  async procesarPeriodo(idPeriodo) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_procesar_periodo_nomina(?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idPeriodo
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Procesar periodo exitosamente',
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
    console.error('Error al procesar periodo:', error);
    return {
      success: false,
      message: 'Error al procesar periodo',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para obtener las nóminas de un período
  async getNominasByPeriodo(idPeriodo) {
    try {
      const nominas = await db.query(`
        SELECT 
          n.id_nomina,
          n.id_periodo,
          n.id_empleado,
          e.codigo_empleado,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
          n.salario_base,
          n.horas_trabajadas,
          n.salario_devengado,
          n.total_deducciones,
          n.total_bonificaciones,
          n.sueldo_liquido,
          n.estado,
          n.fecha_pago
        FROM nominas n
        JOIN empleados e ON n.id_empleado = e.id_empleado
        WHERE n.id_periodo = ?
        ORDER n.id_empleado
      `, [idPeriodo]);
      
      return nominas;
    } catch (error) {
      console.error('Error al obtener nóminas por período:', error);
      throw error;
    }
  }
  
  // Método para obtener una nómina por ID
  async getNominaById(idNomina) {
    try {
      // Obtener la información básica de la nómina
      const nominas = await db.query(`
        SELECT 
          n.id_nomina,
          n.id_periodo,
          n.id_empleado,
          e.codigo_empleado,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
          p.tipo AS tipo_periodo,
          p.fecha_inicio,
          p.fecha_fin,
          n.salario_base,
          n.horas_trabajadas,
          n.salario_devengado,
          n.total_deducciones,
          n.total_bonificaciones,
          n.sueldo_liquido,
          n.estado,
          n.fecha_pago
        FROM nominas n
        JOIN empleados e ON n.id_empleado = e.id_empleado
        JOIN periodos_nomina p ON n.id_periodo = p.id_periodo
        WHERE n.id_nomina = ?
      `, [idNomina]);
      
      if (!nominas.length) {
        return null;
      }
      
      const nomina = nominas[0];
      
// Continuación del archivo src/models/nomina.model.js
      // Obtener las deducciones
      const deducciones = await db.query(`
        SELECT 
          dn.id_deduccion_nomina,
          dn.monto,
          td.nombre,
          td.descripcion
        FROM deducciones_nomina dn
        JOIN tipos_deducciones td ON dn.id_tipo_deduccion = td.id_tipo_deduccion
        WHERE dn.id_nomina = ?
      `, [idNomina]);
      
      // Obtener las bonificaciones
      const bonificaciones = await db.query(`
        SELECT 
          bn.id_bonificacion_nomina,
          bn.monto,
          tb.nombre,
          tb.descripcion
        FROM bonificaciones_nomina bn
        JOIN tipos_bonificaciones tb ON bn.id_tipo_bonificacion = tb.id_tipo_bonificacion
        WHERE bn.id_nomina = ?
      `, [idNomina]);
      
      // Agregar deducciones y bonificaciones a la nómina
      nomina.deducciones = deducciones;
      nomina.bonificaciones = bonificaciones;
      
      return nomina;
    } catch (error) {
      console.error('Error al obtener nómina por ID:', error);
      throw error;
    }
  }
  
  // Método para marcar una nómina como pagada
  async pagarNomina(idNomina, fechaPago) {
  try {
    
    // Obtener una conexión del pool
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_pagar_nomina(?, ?, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idNomina,
        fechaPago,
      ]);
      // Obtener los valores de los parámetros de salida
      const [rows] = await conn.query('SELECT @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Nomina pagada exitosamente',
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
    console.error('Error al pagar nomina:', error);
    return {
      success: false,
      message: 'Error al pagar nomina',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  // Método para calcular la nómina de un empleado en un período específico
  async calcularNominaEmpleado(idEmpleado, idPeriodo) {
    try {
      // Llamar al procedimiento almacenado
      const result = await db.callProcedure('sp_calcular_nomina_empleado', [
        idEmpleado,
        idPeriodo,
        '@id_nomina',
        '@resultado',
        '@mensaje'
      ]);
      
      // Obtener los parámetros de salida
      const outParams = await db.query('SELECT @id_nomina as id, @resultado as resultado, @mensaje as mensaje');
      
      return {
        success: outParams[0].resultado,
        message: outParams[0].mensaje,
        id: outParams[0].id
      };
    } catch (error) {
      console.error('Error al calcular nómina de empleado:', error);
      throw error;
    }
  }
  
  // Método para obtener el historial de nóminas de un empleado
  async getHistorialNominasByEmpleado(idEmpleado) {
    try {
      const nominas = await db.query(`
        SELECT 
          n.id_nomina,
          p.tipo AS tipo_periodo,
          p.fecha_inicio,
          p.fecha_fin,
          n.salario_devengado,
          n.total_deducciones,
          n.total_bonificaciones,
          n.sueldo_liquido,
          n.estado,
          n.fecha_pago
        FROM nominas n
        JOIN periodos_nomina p ON n.id_periodo = p.id_periodo
        WHERE n.id_empleado = ?
        ORDER BY n.id_nomina DESC
      `, [idEmpleado]);
      
      return nominas;
    } catch (error) {
      console.error('Error al obtener historial de nóminas:', error);
      throw error;
    }
  }
}

module.exports = new NominaModel();