const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validaciones para crear/actualizar puesto
const validarPuesto = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('id_departamento').isInt().withMessage('El ID de departamento debe ser un número entero'),
  body('salario_base').isFloat({ min: 0 }).withMessage('El salario base debe ser un número positivo')
];

// Obtener todos los puestos
router.get('/', verifyToken, async (req, res) => {
  try {
    const puestos = await db.query(`
      SELECT p.*, d.nombre as departamento
      FROM puestos p
      JOIN departamentos d ON p.id_departamento = d.id_departamento
      ORDER BY p.nombre
    `);
    
    res.status(200).json({
      success: true,
      data: puestos
    });
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los puestos',
      error: error.message
    });
  }
});

// Obtener puestos por departamento
router.get('/departamento/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const puestos = await db.query(`
      SELECT p.*, d.nombre as departamento
      FROM puestos p
      JOIN departamentos d ON p.id_departamento = d.id_departamento
      WHERE p.id_departamento = ?
      ORDER BY p.nombre
    `, [id]);
    
    res.status(200).json({
      success: true,
      data: puestos
    });
  } catch (error) {
    console.error('Error al obtener puestos por departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los puestos por departamento',
      error: error.message
    });
  }
});

// Crear puesto
router.post('/', verifyToken, isAdmin, validarPuesto, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }
    
    const { nombre, descripcion, salario_base, id_departamento } = req.body;
    
    // Verificar que el departamento existe
    const departamentos = await db.query(
      'SELECT id_departamento FROM departamentos WHERE id_departamento = ?',
      [id_departamento]
    );
    
    if (departamentos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El departamento no existe'
      });
    }
    
    const result = await db.query(
      'INSERT INTO puestos (nombre, descripcion, salario_base, id_departamento) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, salario_base, id_departamento]
    );
    
    res.status(201).json({
      success: true,
      message: 'Puesto creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear puesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el puesto',
      error: error.message
    });
  }
});

// Actualizar puesto
router.put('/:id', verifyToken, isAdmin, validarPuesto, async (req, res) => {
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
    const { nombre, descripcion, salario_base, id_departamento, activo } = req.body;
    
    // Verificar que el departamento existe
    const departamentos = await db.query(
      'SELECT id_departamento FROM departamentos WHERE id_departamento = ?',
      [id_departamento]
    );
    
    if (departamentos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El departamento no existe'
      });
    }
    
    const result = await db.query(
      'UPDATE puestos SET nombre = ?, descripcion = ?, salario_base = ?, id_departamento = ?, activo = ? WHERE id_puesto = ?',
      [nombre, descripcion || null, salario_base, id_departamento, activo !== undefined ? activo : true, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Puesto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Puesto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar puesto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el puesto',
      error: error.message
    });
  }
});

module.exports = router;