const express = require('express');
const router = express.Router();
const liquidacionController = require('../controllers/liquidacion.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validaciones para calcular liquidación
const validarCalcularLiquidacion = [
  body('id_empleado').isInt().withMessage('El ID de empleado debe ser un número entero'),
  body('fecha_liquidacion').isDate().withMessage('La fecha de liquidación debe ser una fecha válida'),
  body('motivo').isIn(['DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'RENUNCIA', 'MUTUO_ACUERDO', 'FALLECIMIENTO']).withMessage('El motivo no es válido')
];

// Todas las rutas requieren autenticación y rol de administrador
router.post('/', verifyToken, isAdmin, validarCalcularLiquidacion, liquidacionController.calcularLiquidacion);
router.get('/', verifyToken, isAdmin, liquidacionController.getAllLiquidaciones);
router.get('/:id', verifyToken, isAdmin, liquidacionController.getLiquidacionById);
router.patch('/:id/pagar', verifyToken, isAdmin, liquidacionController.pagarLiquidacion);

module.exports = router;