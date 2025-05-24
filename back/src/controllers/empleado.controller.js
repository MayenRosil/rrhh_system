const empleadoModel = require('../models/empleado.model');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

class EmpleadoController {
  async getAll(req, res) {
    try {
      const empleados = await empleadoModel.getAll();
      
      return res.status(200).json({
        success: true,
        data: empleados
      });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la lista de empleados',
        error: error.message
      });
    }
  }
  
  async getById(req, res) {
    try {
      const { id } = req.params;
      const empleado = await empleadoModel.getById(id);
      
      if (!empleado) {
        return res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: empleado
      });
    } catch (error) {
      console.error('Error al obtener empleado por ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el empleado',
        error: error.message
      });
    }
  }
  
  async create(req, res) {
    console.log('Creando empleado:', req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      const result = await empleadoModel.create(req.body);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Error al crear empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear el empleado',
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      
      const result = await empleadoModel.update(id, req.body);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el empleado',
        error: error.message
      });
    }
  }
  
  async updateSalario(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      
      req.body.id_usuario_modificacion = req.user.id;
      
      const result = await empleadoModel.updateSalario(id, req.body);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al actualizar salario:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el salario',
        error: error.message
      });
    }
  }
  
  async darDeBaja(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      
      const result = await empleadoModel.darDeBaja(id, req.body);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error al dar de baja al empleado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al dar de baja al empleado',
        error: error.message
      });
    }
  }

  async getHistorialSalarios(req, res) {
    try {
      const { id } = req.params;
      
      const empleado = await empleadoModel.getById(id);
      if (!empleado) {
        return res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
      }
      
      const historial = await empleadoModel.getHistorialSalarios(id);
      
      return res.status(200).json({
        success: true,
        data: historial
      });
    } catch (error) {
      console.error('Error al obtener historial de salarios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el historial de salarios',
        error: error.message
      });
    }
  }
}

module.exports = new EmpleadoController();