const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacaciones.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validaciones para solicitar vacaciones
const validarSolicitarVacaciones = [
  body('fecha_inicio').isDate().withMessage('La fecha de inicio debe ser una fecha válida'),
  body('fecha_fin').isDate().withMessage('La fecha de fin debe ser una fecha válida')
];

// Rutas para empleados
router.post('/solicitar', verifyToken, validarSolicitarVacaciones, vacacionesController.solicitarVacaciones);
router.get('/mis-solicitudes', verifyToken, vacacionesController.getMisSolicitudesVacaciones);
router.get('/mis-periodos', verifyToken, vacacionesController.getMisPeriodosVacacionales);

// Rutas para administradores
router.get('/solicitudes', verifyToken, isAdmin, vacacionesController.getSolicitudesVacaciones);
router.get('/empleado/:id/solicitudes', verifyToken, isAdmin, vacacionesController.getSolicitudesVacacionesByEmpleado);
router.get('/empleado/:id/periodos', verifyToken, isAdmin, vacacionesController.getPeriodosVacacionalesByEmpleado);
router.patch('/solicitudes/:id/aprobar', verifyToken, isAdmin, vacacionesController.aprobarVacaciones);
router.patch('/solicitudes/:id/rechazar', verifyToken, isAdmin, vacacionesController.rechazarVacaciones);

module.exports = router;