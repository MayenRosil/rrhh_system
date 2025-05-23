const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleado.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validaciones para crear empleado
const validarCrearEmpleado = [
  body('codigo_empleado').notEmpty().withMessage('El código de empleado es obligatorio'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('dpi').notEmpty().withMessage('El DPI es obligatorio'),
  body('fecha_nacimiento').isDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),
  body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  body('id_puesto').isInt().withMessage('El ID de puesto debe ser un número entero'),
  body('id_rol').isInt().withMessage('El ID de rol debe ser un número entero'),
  body('fecha_contratacion').isDate().withMessage('La fecha de contratación debe ser una fecha válida'),
  body('salario_actual').isFloat({ min: 0 }).withMessage('El salario debe ser un número positivo'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para actualizar empleado
const validarActualizarEmpleado = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  body('id_puesto').isInt().withMessage('El ID de puesto debe ser un número entero'),
  body('id_rol').isInt().withMessage('El ID de rol debe ser un número entero'),
];

// Validaciones para actualizar salario
const validarActualizarSalario = [
  body('salario_nuevo').isFloat({ min: 0 }).withMessage('El nuevo salario debe ser un número positivo'),
  body('motivo').notEmpty().withMessage('El motivo es obligatorio')
];

// Validaciones para dar de baja
const validarDarDeBaja = [
  body('fecha_fin').isDate().withMessage('La fecha de fin debe ser una fecha válida'),
  body('motivo').isIn(['DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'RENUNCIA', 'MUTUO_ACUERDO', 'FALLECIMIENTO']).withMessage('El motivo no es válido')
];

// Rutas (todas requieren autenticación y rol de administrador)
router.get('/', verifyToken, isAdmin, empleadoController.getAll);
router.get('/:id', verifyToken, isAdmin, empleadoController.getById);
router.post('/', verifyToken, isAdmin, validarCrearEmpleado, empleadoController.create);
router.put('/:id', verifyToken, isAdmin, validarActualizarEmpleado, empleadoController.update);
router.patch('/:id/salario', verifyToken, isAdmin, validarActualizarSalario, empleadoController.updateSalario);
router.patch('/:id/baja', verifyToken, isAdmin, validarDarDeBaja, empleadoController.darDeBaja);
router.get('/:id/historial-salarios', verifyToken, isAdmin, empleadoController.getHistorialSalarios);

module.exports = router;