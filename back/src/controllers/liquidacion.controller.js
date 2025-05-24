const liquidacionModel = require('../models/liquidacion.model');
const moment = require('moment');
const { validationResult } = require('express-validator');

class LiquidacionController {
  async calcularLiquidacion(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      

      if (moment(req.body.fecha_liquidacion).isAfter(moment(), 'day')) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de liquidación no puede ser futura'
        });
      }
      
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

  async pagarLiquidacion(req, res) {
    try {
      const { id } = req.params;
      const { fecha_pago, observaciones } = req.body;
      
      if (!fecha_pago || !moment(fecha_pago, 'YYYY-MM-DD').isValid()) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una fecha de pago válida'
        });
      }
      
      const liquidacion = await liquidacionModel.getLiquidacionById(id);
      if (!liquidacion) {
        return res.status(404).json({
          success: false,
          message: 'Liquidación no encontrada'
        });
      }
      
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