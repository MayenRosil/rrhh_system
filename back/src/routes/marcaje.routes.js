const express = require('express');
const router = express.Router();
const marcajeController = require('../controllers/marcaje.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Rutas para empleados
router.post('/entrada', verifyToken, marcajeController.registrarEntrada);
router.post('/salida', verifyToken, marcajeController.registrarSalida);
router.get('/mis-marcajes', verifyToken, marcajeController.getMisMarcajes);

// Rutas para administradores
router.get('/', verifyToken, isAdmin, marcajeController.getAllMarcajes);
router.get('/empleado/:id', verifyToken, isAdmin, marcajeController.getMarcajesEmpleado);
router.patch('/:id/estado', verifyToken, isAdmin, marcajeController.updateEstado);

module.exports = router;