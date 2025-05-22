const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validaciones para crear/actualizar departamento
const validarDepartamento = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
];

// Obtener todos los departamentos
router.get('/', verifyToken, async (req, res) => {
  try {
    const departamentos = await db.query(
      'SELECT * FROM departamentos ORDER BY nombre'
    );
    
    res.status(200).json({
      success: true,
      data: departamentos
    });
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los departamentos',
      error: error.message
    });
  }
});

// Crear departamento (solo admin)
router.post('/', verifyToken, isAdmin, validarDepartamento, async (req, res) => {
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
    
    const { nombre, descripcion } = req.body;
    
    const result = await db.query(
      'INSERT INTO departamentos (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Departamento creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el departamento',
      error: error.message
    });
  }
});

// Actualizar departamento (solo admin)
router.put('/:id', verifyToken, isAdmin, validarDepartamento, async (req, res) => {
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
    
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    const result = await db.query(
      'UPDATE departamentos SET nombre = ?, descripcion = ?, activo = ? WHERE id_departamento = ?',
      [nombre, descripcion || null, activo !== undefined ? activo : true, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Departamento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el departamento',
      error: error.message
    });
  }
});

module.exports = router;