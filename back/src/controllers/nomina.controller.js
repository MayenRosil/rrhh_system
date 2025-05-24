const nominaModel = require('../models/nomina.model');
const moment = require('moment');
const { validationResult } = require('express-validator');

class NominaController {
  async crearPeriodo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      if (moment(req.body.fecha_inicio).isAfter(req.body.fecha_fin)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio debe ser anterior a la fecha de fin'
        });
      }
      
      const result = await nominaModel.crearPeriodo(req.body);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Error al crear período de nómina:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear el período de nómina',
        error: error.message
      });
    }
  }
  
  async getPeriodos(req, res) {
    try {
      const periodos = await nominaModel.getPeriodos();
      
      return res.status(200).json({
        success: true,
        data: periodos
      });
    } catch (error) {
      console.error('Error al obtener períodos de nómina:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los períodos de nómina',
        error: error.message
      });
    }
  }
  
  async getPeriodoById(req, res) {
    try {
      const { id } = req.params;
      const periodo = await nominaModel.getPeriodoById(id);
      
      if (!periodo) {
        return res.status(404).json({
          success: false,
          message: 'Período de nómina no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: periodo
      });
    } catch (error) {
      console.error('Error al obtener período de nómina por ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el período de nómina',
        error: error.message
      });
    }
  }
  
  async procesarPeriodo(req, res) {
    try {
      const { id } = req.params;
      
      const periodo = await nominaModel.getPeriodoById(id);
      if (!periodo) {
        return res.status(404).json({
          success: false,
          message: 'Período de nómina no encontrado'
        });
      }
      
      const result = await nominaModel.procesarPeriodo(id);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al procesar período de nómina:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al procesar el período de nómina',
        error: error.message
      });
    }
  }
  
  async getNominasByPeriodo(req, res) {
    try {
      const { id } = req.params;
      
      const periodo = await nominaModel.getPeriodoById(id);
      if (!periodo) {
        return res.status(404).json({
          success: false,
          message: 'Período de nómina no encontrado'
        });
      }
      
      const nominas = await nominaModel.getNominasByPeriodo(id);
      
      return res.status(200).json({
        success: true,
        data: nominas
      });
    } catch (error) {
      console.error('Error al obtener nóminas por período:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las nóminas del período',
        error: error.message
      });
    }
  }
  
  async getNominaById(req, res) {
    try {
      const { id } = req.params;
      const nomina = await nominaModel.getNominaById(id);
      
      if (!nomina) {
        return res.status(404).json({
          success: false,
          message: 'Nómina no encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: nomina
      });
    } catch (error) {
      console.error('Error al obtener nómina por ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la nómina',
        error: error.message
      });
    }
  }
  
  async pagarNomina(req, res) {
    try {
      const { id } = req.params;
      const { fecha_pago } = req.body;
      
      if (!fecha_pago || !moment(fecha_pago, 'YYYY-MM-DD').isValid()) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una fecha de pago válida'
        });
      }
      
      const nomina = await nominaModel.getNominaById(id);
      if (!nomina) {
        return res.status(404).json({
          success: false,
          message: 'Nómina no encontrada'
        });
      }
      
      const result = await nominaModel.pagarNomina(id, fecha_pago);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al pagar nómina:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al pagar la nómina',
        error: error.message
      });
    }
  }
  
  async calcularNominaEmpleado(req, res) {
  try {
    
    const conn = await db.pool.getConnection();
    
    try {
             const query = `
        CALL sp_calcular_nomina_empleado(?, ?, @id_nomina, @p_resultado, @p_mensaje)
      `;
      
      await conn.query(query, [
        idEmpleado,
        idPeriodo,
      ]);
      const [rows] = await conn.query('SELECT @id_nomina as nomina, @p_resultado as resultado, @p_mensaje as mensaje');
      
      console.log('Parámetros de salida:', rows);
      
      if (rows && rows.length > 0) {
        return {
          success: rows[0].resultado > 0,
          message: rows[0].mensaje || 'Nomina calculada exitosamente',
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
      conn.release();
    }
  } catch (error) {
    console.error('Error al calcular nomina :', error);
    return {
      success: false,
      message: 'Error al calcular nomina',
      error: error.message || 'Error interno del servidor'
    };
  }
  }
  
  async getHistorialNominasByEmpleado(req, res) {
    try {
      const { id } = req.params;
      
      const nominas = await nominaModel.getHistorialNominasByEmpleado(id);
      
      return res.status(200).json({
        success: true,
        data: nominas
      });
    } catch (error) {
      console.error('Error al obtener historial de nóminas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el historial de nóminas',
        error: error.message
      });
    }
  }
  
  async getMiHistorialNominas(req, res) {
    try {
      const idEmpleado = req.user.id;
      
      const nominas = await nominaModel.getHistorialNominasByEmpleado(idEmpleado);
      
      return res.status(200).json({
        success: true,
        data: nominas
      });
    } catch (error) {
      console.error('Error al obtener mi historial de nóminas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener tu historial de nóminas',
        error: error.message
      });
    }
  }
}

module.exports = new NominaController();