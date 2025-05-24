const marcajeModel = require('../models/marcaje.model');
const moment = require('moment');

class MarcajeController {
  async registrarEntrada(req, res) {
    try {
      const idEmpleado = req.user.id;
      
      const result = await marcajeModel.registrarEntrada(idEmpleado);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Error al registrar entrada:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar la entrada',
        error: error.message
      });
    }
  }
  
  async registrarSalida(req, res) {
    try {
      const idEmpleado = req.user.id;
      
      const result = await marcajeModel.registrarSalida(idEmpleado);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al registrar salida:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar la salida',
        error: error.message
      });
    }
  }
  
  async getMisMarcajes(req, res) {
    try {
      const idEmpleado = req.user.id;
      const { fechaInicio, fechaFin } = req.query;
      
      const fechaInicioValida = fechaInicio ? moment(fechaInicio, 'YYYY-MM-DD').isValid() : false;
      const fechaFinValida = fechaFin ? moment(fechaFin, 'YYYY-MM-DD').isValid() : false;
      
      const inicio = fechaInicioValida ? 
        moment(fechaInicio).format('YYYY-MM-DD') : 
        moment().startOf('month').format('YYYY-MM-DD');
      
      const fin = fechaFinValida ? 
        moment(fechaFin).format('YYYY-MM-DD') : 
        moment().endOf('month').format('YYYY-MM-DD');
      
      const marcajes = await marcajeModel.getMarcajesByEmpleado(idEmpleado, inicio, fin);
      
      return res.status(200).json({
        success: true,
        data: marcajes
      });
    } catch (error) {
      console.error('Error al obtener marcajes:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los marcajes',
        error: error.message
      });
    }
  }
  
  async getMarcajesEmpleado(req, res) {
    try {
      const { id } = req.params;
      const { fechaInicio, fechaFin } = req.query;
      
      const fechaInicioValida = fechaInicio ? moment(fechaInicio, 'YYYY-MM-DD').isValid() : false;
      const fechaFinValida = fechaFin ? moment(fechaFin, 'YYYY-MM-DD').isValid() : false;
      
      const inicio = fechaInicioValida ? 
        moment(fechaInicio).format('YYYY-MM-DD') : 
        moment().startOf('month').format('YYYY-MM-DD');
      
      const fin = fechaFinValida ? 
        moment(fechaFin).format('YYYY-MM-DD') : 
        moment().endOf('month').format('YYYY-MM-DD');
      
      const marcajes = await marcajeModel.getMarcajesByEmpleado(id, inicio, fin);
      
      return res.status(200).json({
        success: true,
        data: marcajes
      });
    } catch (error) {
      console.error('Error al obtener marcajes del empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los marcajes del empleado',
        error: error.message
      });
    }
  }
  
  async getAllMarcajes(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      const fechaInicioValida = fechaInicio ? moment(fechaInicio, 'YYYY-MM-DD').isValid() : false;
      const fechaFinValida = fechaFin ? moment(fechaFin, 'YYYY-MM-DD').isValid() : false;
      
      const inicio = fechaInicioValida ? 
        moment(fechaInicio).format('YYYY-MM-DD') : 
        moment().startOf('month').format('YYYY-MM-DD');
      
      const fin = fechaFinValida ? 
        moment(fechaFin).format('YYYY-MM-DD') : 
        moment().endOf('month').format('YYYY-MM-DD');
      
      const marcajes = await marcajeModel.getAllMarcajes(inicio, fin);
      
      return res.status(200).json({
        success: true,
        data: marcajes
      });
    } catch (error) {
      console.error('Error al obtener todos los marcajes:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener todos los marcajes',
        error: error.message
      });
    }
  }
  
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado, observaciones } = req.body;
      
      if (!estado || !['PENDIENTE', 'APROBADO', 'RECHAZADO'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido'
        });
      }
      
      const result = await marcajeModel.updateEstado(id, estado, observaciones || '');
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al actualizar estado de marcaje:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado del marcaje',
        error: error.message
      });
    }
  }
}

module.exports = new MarcajeController();