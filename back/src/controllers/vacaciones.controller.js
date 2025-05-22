const vacacionesModel = require('../models/vacaciones.model');
const moment = require('moment');
const { validationResult } = require('express-validator');

class VacacionesController {
  // Método para solicitar vacaciones
  async solicitarVacaciones(req, res) {
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
      
      // Validar que la fecha de inicio sea anterior a la fecha de fin
      if (moment(req.body.fecha_inicio).isAfter(req.body.fecha_fin)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio debe ser anterior a la fecha de fin'
        });
      }
      
      // Validar que la fecha de inicio sea futura
      if (moment(req.body.fecha_inicio).isBefore(moment(), 'day')) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio debe ser futura'
        });
      }
      
      // Agregar el ID del empleado que hace la solicitud
      req.body.id_empleado = req.user.id;
      
      // Solicitar vacaciones
      const result = await vacacionesModel.solicitarVacaciones(req.body);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Error al solicitar vacaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al solicitar vacaciones',
        error: error.message
      });
    }
  }
  
  // Método para aprobar vacaciones (admin)
  async aprobarVacaciones(req, res) {
    try {
      const { id } = req.params;
      
      // Aprobar vacaciones
      const result = await vacacionesModel.aprobarVacaciones(id);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al aprobar vacaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al aprobar las vacaciones',
        error: error.message
      });
    }
  }
  
  // Método para rechazar vacaciones (admin)
  async rechazarVacaciones(req, res) {
    try {
      const { id } = req.params;
      const { observaciones } = req.body;
      
      // Validar que se proporcionaron observaciones
      if (!observaciones) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere incluir observaciones al rechazar las vacaciones'
        });
      }
      
      // Rechazar vacaciones
      const result = await vacacionesModel.rechazarVacaciones(id, observaciones);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al rechazar vacaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al rechazar las vacaciones',
        error: error.message
      });
    }
  }
  
  // Método para obtener las solicitudes de vacaciones (admin)
  async getSolicitudesVacaciones(req, res) {
    try {
      const { estado } = req.query;
      
      // Obtener solicitudes
      const solicitudes = await vacacionesModel.getSolicitudesVacaciones(estado);
      
      return res.status(200).json({
        success: true,
        data: solicitudes
      });
    } catch (error) {
      console.error('Error al obtener solicitudes de vacaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las solicitudes de vacaciones',
        error: error.message
      });
    }
  }
  
  // Método para obtener mis solicitudes de vacaciones (empleado actual)
  async getMisSolicitudesVacaciones(req, res) {
    try {
      const idEmpleado = req.user.id;
      
      // Obtener solicitudes
      const solicitudes = await vacacionesModel.getSolicitudesVacacionesByEmpleado(idEmpleado);
      
      return res.status(200).json({
        success: true,
        data: solicitudes
      });
    } catch (error) {
      console.error('Error al obtener mis solicitudes de vacaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener tus solicitudes de vacaciones',
        error: error.message
      });
    }
  }
  
  // Método para obtener las solicitudes de vacaciones de un empleado (admin)
  async getSolicitudesVacacionesByEmpleado(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener solicitudes
      const solicitudes = await vacacionesModel.getSolicitudesVacacionesByEmpleado(id);
      
      return res.status(200).json({
        success: true,
        data: solicitudes
      });
    } catch (error) {
      console.error('Error al obtener solicitudes de vacaciones por empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las solicitudes de vacaciones del empleado',
        error: error.message
      });
    }
  }
  
  // Método para obtener mis períodos vacacionales (empleado actual)
  async getMisPeriodosVacacionales(req, res) {
    try {
      const idEmpleado = req.user.id;
      
      // Obtener períodos
      const periodos = await vacacionesModel.getPeriodosVacacionalesByEmpleado(idEmpleado);
      
      return res.status(200).json({
        success: true,
        data: periodos
      });
    } catch (error) {
      console.error('Error al obtener mis períodos vacacionales:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener tus períodos vacacionales',
        error: error.message
      });
    }
  }
  
  // Método para obtener los períodos vacacionales de un empleado (admin)
  async getPeriodosVacacionalesByEmpleado(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener períodos
      const periodos = await vacacionesModel.getPeriodosVacacionalesByEmpleado(id);
      
      return res.status(200).json({
        success: true,
        data: periodos
      });
    } catch (error) {
      console.error('Error al obtener períodos vacacionales por empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los períodos vacacionales del empleado',
        error: error.message
      });
    }
  }
}

module.exports = new VacacionesController();