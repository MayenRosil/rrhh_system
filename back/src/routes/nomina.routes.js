const express = require('express');
const router = express.Router();
const nominaController = require('../controllers/nomina.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validaciones para crear período
const validarCrearPeriodo = [
  body('tipo').isIn(['SEMANAL', 'QUINCENAL', 'MENSUAL']).withMessage('El tipo debe ser SEMANAL, QUINCENAL o MENSUAL'),
  body('fecha_inicio').isDate().withMessage('La fecha de inicio debe ser una fecha válida'),
  body('fecha_fin').isDate().withMessage('La fecha de fin debe ser una fecha válida')
];

// Rutas para empleados
router.get('/mi-historial', verifyToken, nominaController.getMiHistorialNominas);

// Rutas para administradores
router.post('/periodos', verifyToken, isAdmin, validarCrearPeriodo, nominaController.crearPeriodo);
router.get('/periodos', verifyToken, isAdmin, nominaController.getPeriodos);
router.get('/periodos/:id', verifyToken, isAdmin, nominaController.getPeriodoById);
router.post('/periodos/:id/procesar', verifyToken, isAdmin, nominaController.procesarPeriodo);
router.get('/periodos/:id/nominas', verifyToken, isAdmin, nominaController.getNominasByPeriodo);
router.get('/nominas/:id', verifyToken, isAdmin, nominaController.getNominaById);
router.patch('/nominas/:id/pagar', verifyToken, isAdmin, nominaController.pagarNomina);
router.post('/empleados/:idEmpleado/periodos/:idPeriodo/calcular', verifyToken, isAdmin, nominaController.calcularNominaEmpleado);
router.get('/empleados/:id/historial', verifyToken, isAdmin, nominaController.getHistorialNominasByEmpleado);

module.exports = router;