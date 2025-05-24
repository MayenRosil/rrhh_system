const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const departamentoRoutes = require('./routes/departamento.routes');
const puestoRoutes = require('./routes/puesto.routes');
const marcajeRoutes = require('./routes/marcaje.routes');
const nominaRoutes = require('./routes/nomina.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const liquidacionRoutes = require('./routes/liquidacion.routes');
const reportesRoutes = require('./routes/reportes.routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/puestos', puestoRoutes);
app.use('/api/marcajes', marcajeRoutes);
app.use('/api/nomina', nominaRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);
app.use('/api/reportes', reportesRoutes);


app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;