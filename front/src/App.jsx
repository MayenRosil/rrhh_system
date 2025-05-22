import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

// Páginas públicas
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Páginas generales
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import CambiarPassword from './pages/CambiarPassword';
import Unauthorized from './pages/Unauthorized';

// Páginas de empleados
import ListaEmpleados from './pages/empleados/ListaEmpleados';
import NuevoEmpleado from './pages/empleados/NuevoEmpleado';
import EditarEmpleado from './pages/empleados/EditarEmpleado';
import ActualizarSalario from './pages/empleados/ActualizarSalario';
import DarDeBaja from './pages/empleados/DarDeBaja';

// Páginas de marcajes
import MisMarcajes from './pages/marcajes/MisMarcajes';
import GestionMarcajes from './pages/marcajes/GestionMarcajes';

// Páginas de nómina
import PeriodosNomina from './pages/nomina/PeriodosNomina';
import NuevoPeriodo from './pages/nomina/NuevoPeriodo';
import ListaNominas from './pages/nomina/ListaNominas';
import DetalleNomina from './pages/nomina/DetalleNomina';
import MiHistorialNomina from './pages/nomina/MiHistorialNomina';

// Páginas de vacaciones
import MisSolicitudesVacaciones from './pages/vacaciones/MisSolicitudesVacaciones';
import SolicitarVacaciones from './pages/vacaciones/SolicitarVacaciones';
import GestionSolicitudesVacaciones from './pages/vacaciones/GestionSolicitudesVacaciones';

// Páginas de liquidaciones
import ListaLiquidaciones from './pages/liquidaciones/ListaLiquidaciones';
import NuevaLiquidacion from './pages/liquidaciones/NuevaLiquidacion';
import DetalleLiquidacion from './pages/liquidaciones/DetalleLiquidacion';

// Páginas de reportes
import ReporteNomina from './pages/reportes/ReporteNomina';
import ReporteMarcajes from './pages/reportes/ReporteMarcajes';
import ReporteVacaciones from './pages/reportes/ReporteVacaciones';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Rutas privadas */}
          <Route path="/" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <Dashboard />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <Dashboard />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/perfil" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <Perfil />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/cambiar-password" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <CambiarPassword />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de empleados (Admin) */}
          <Route path="/empleados" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ListaEmpleados />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/empleados/nuevo" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <NuevoEmpleado />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/empleados/:id" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <EditarEmpleado />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/empleados/:id/salario" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ActualizarSalario />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/empleados/:id/baja" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <DarDeBaja />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de marcajes */}
          <Route path="/marcajes" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <MisMarcajes />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/marcajes/gestion" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <GestionMarcajes />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de nómina */}
          <Route path="/nomina/periodos" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <PeriodosNomina />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/nomina/periodos/nuevo" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <NuevoPeriodo />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/nomina/periodos/:id/nominas" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ListaNominas />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/nomina/nominas/:id" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <DetalleNomina />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/nomina/mi-historial" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <MiHistorialNomina />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de vacaciones */}
          <Route path="/vacaciones/mis-solicitudes" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <MisSolicitudesVacaciones />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/vacaciones/solicitar" element={
            <PrivateRoute>
              <Header />
              <div className="py-4">
                <SolicitarVacaciones />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/vacaciones/solicitudes" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <GestionSolicitudesVacaciones />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de liquidaciones */}
          <Route path="/liquidaciones" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ListaLiquidaciones />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/liquidaciones/nueva" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <NuevaLiquidacion />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/liquidaciones/:id" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <DetalleLiquidacion />
              </div>
            </PrivateRoute>
          } />
          
          {/* Rutas de reportes */}
          <Route path="/reportes/nomina/:id" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ReporteNomina />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/reportes/marcajes" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ReporteMarcajes />
              </div>
            </PrivateRoute>
          } />
          
          <Route path="/reportes/vacaciones" element={
            <PrivateRoute adminOnly={true}>
              <Header />
              <div className="py-4">
                <ReporteVacaciones />
              </div>
            </PrivateRoute>
          } />
          
          {/* Ruta por defecto (redirección a dashboard) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;