const db = require('../config/database');

class LiquidacionModel {
  // Método para calcular liquidación
  async calcularLiquidacion(liquidacionData) {
    try {
      // Llamar al procedimiento almacenado
      const result = await db.callProcedure('sp_calcular_liquidacion', [
        liquidacionData.id_empleado,
        liquidacionData.fecha_liquidacion,
        liquidacionData.motivo,
        '@id_liquidacion',
        '@resultado',
        '@mensaje'
      ]);
      
      // Obtener los parámetros de salida
      const outParams = await db.query('SELECT @id_liquidacion as id, @resultado as resultado, @mensaje as mensaje');
      
      return {
        success: outParams[0].resultado,
        message: outParams[0].mensaje,
        id: outParams[0].id
      };
    } catch (error) {
      console.error('Error al calcular liquidación:', error);
      throw error;
    }
  }
  
  // Método para obtener todas las liquidaciones
  async getAllLiquidaciones() {
    try {
      const liquidaciones = await db.query(`
        SELECT 
          l.id_liquidacion,
          l.id_empleado,
          e.codigo_empleado,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
          l.fecha_liquidacion,
          l.motivo,
          l.anos_laborados,
          l.salario_promedio,
          l.indemnizacion,
          l.aguinaldo_proporcional,
          l.bono14_proporcional,
          l.vacaciones_pendientes,
          l.otros_pagos,
          l.total_deducciones,
          l.total_liquidacion,
          l.estado,
          l.fecha_pago
        FROM liquidaciones l
        JOIN empleados e ON l.id_empleado = e.id_empleado
        ORDER BY l.fecha_liquidacion DESC
      `);
      
      return liquidaciones;
    } catch (error) {
      console.error('Error al obtener liquidaciones:', error);
      throw error;
    }
  }
  
  // Método para obtener una liquidación por ID
  async getLiquidacionById(idLiquidacion) {
    try {
      // Obtener la información básica de la liquidación
      const liquidaciones = await db.query(`
        SELECT 
          l.id_liquidacion,
          l.id_empleado,
          e.codigo_empleado,
          e.dpi,
          CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
          l.fecha_liquidacion,
          l.motivo,
          l.anos_laborados,
          l.salario_promedio,
          l.indemnizacion,
          l.aguinaldo_proporcional,
          l.bono14_proporcional,
          l.vacaciones_pendientes,
          l.otros_pagos,
          l.total_deducciones,
          l.total_liquidacion,
          l.estado,
          l.observaciones,
          l.fecha_pago,
          e.fecha_contratacion,
          e.fecha_fin_contrato
        FROM liquidaciones l
        JOIN empleados e ON l.id_empleado = e.id_empleado
        WHERE l.id_liquidacion = ?
      `, [idLiquidacion]);
      
      if (!liquidaciones.length) {
        return null;
      }
      
      const liquidacion = liquidaciones[0];
      
      // Obtener las deducciones
      const deducciones = await db.query(`
        SELECT 
          dl.id_deduccion_liquidacion,
          dl.monto,
          td.nombre,
          td.descripcion
        FROM deducciones_liquidacion dl
        JOIN tipos_deducciones td ON dl.id_tipo_deduccion = td.id_tipo_deduccion
        WHERE dl.id_liquidacion = ?
      `, [idLiquidacion]);
      
      // Agregar deducciones a la liquidación
      liquidacion.deducciones = deducciones;
      
      return liquidacion;
    } catch (error) {
      console.error('Error al obtener liquidación por ID:', error);
      throw error;
    }
  }
  
  // Método para marcar una liquidación como pagada
  async pagarLiquidacion(idLiquidacion, fechaPago, observaciones) {
    try {
      const result = await db.query(`
        UPDATE liquidaciones
        SET 
          estado = 'PAGADO',
          fecha_pago = ?,
          observaciones = ?
        WHERE id_liquidacion = ?
      `, [fechaPago, observaciones, idLiquidacion]);
      
      return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? 'Liquidación pagada correctamente' : 'No se pudo marcar la liquidación como pagada'
      };
    } catch (error) {
      console.error('Error al pagar liquidación:', error);
      throw error;
    }
  }
}

module.exports = new LiquidacionModel();