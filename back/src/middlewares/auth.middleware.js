const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Se requiere un token para la autenticación'
    });
  }
  
  try {
    const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar roles
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Administrador') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Se requiere rol de Administrador'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};