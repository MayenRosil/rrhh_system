const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para obtener información del perfil (requiere autenticación)
router.get('/profile', verifyToken, authController.getProfile);

// Ruta para cambiar contraseña (requiere autenticación)
router.post('/change-password', verifyToken, authController.changePassword);

// Ruta para obtener roles
router.get('/roles', verifyToken, authController.getRoles);

module.exports = router;