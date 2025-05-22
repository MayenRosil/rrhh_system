const liquidacionModel = require('../models/liquidacion.model');
const moment = require('moment');
const { validationResult } = require('express-validator');

class LiquidacionController {
  // Método para calcular liquidación
  async calcularLiquidacion(req, res) {
    try {
      // Validar los datos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      // Validar que la fecha de liquidación no sea futura
      if (moment(req.body.fecha_liquidacion).isAfter(moment(), 'day')) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de liquidación no puede ser futura'
        });
      }
      
      // Calcular liquidación
      const result = await liquidacionModel.calcularLiquidacion(req.body);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Error al calcular liquidación:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al calcular la liquidación',
        error: error.message
      });
    }
  }
  
  // Método para obtener todas las liquidaciones
  async getAllLiquidaciones(req, res) {
    try {
      const liquidaciones = await liquidacionModel.getAllLiquidaciones();
      
      return res.status(200).json({
        success: true,
        data: liquidaciones
      });
    } catch (error) {
      console.error('Error al obtener liquidaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las liquidaciones',
        error: error.message
      });
    }
  }
  
  // Método para obtener una liquidación por ID
  async getLiquidacionById(req, res) {
    try {
      const { id } = req.params;
      const liquidacion = await liquidacionModel.getLiquidacionById(id);
      
      if (!liquidacion) {
        return res.status(404).json({
          success: false,
          message: 'Liquidación no encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: liquidacion
      });
    } catch (error) {
      console.error('Error al obtener liquidación por ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la liquidación',
        error: error.message
      });
    }
  }
  
  // Método para marcar una liquidación como pagada
  async pagarLiquidacion(req, res) {
    try {
      const { id } = req.params;
      const { fecha_pago, observaciones } = req.body;
      
      // Validar que se proporcionó la fecha de pago
      if (!fecha_pago || !moment(fecha_pago, 'YYYY-MM-DD').isValid()) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una fecha de pago válida'
        });
      }
      
      // Verificar que la liquidación existe
      const liquidacion = await liquidacionModel.getLiquidacionById(id);
      if (!liquidacion) {
        return res.status(404).json({
          success: false,
          message: 'Liquidación no encontrada'
        });
      }
      
      // Pagar la liquidación
      const result = await liquidacionModel.pagarLiquidacion(id, fecha_pago, observaciones || '');
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al pagar liquidación:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al pagar la liquidación',
        error: error.message
      });
    }
  }
}

module.exports = new LiquidacionController();