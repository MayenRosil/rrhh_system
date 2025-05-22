import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Sistema RRHH</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Inicio</Nav.Link>
            
            {isAdmin() && (
              <>

                <NavDropdown title="Marcajes" id="marcajes-dropdown">
                  <NavDropdown.Item as={Link} to="/marcajes/gestion">Gestión de Marcajes</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Empleados" id="empleados-dropdown">
                  <NavDropdown.Item as={Link} to="/empleados">Lista de Empleados</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/empleados/nuevo">Nuevo Empleado</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Nómina" id="nomina-dropdown">
                  <NavDropdown.Item as={Link} to="/nomina/periodos">Períodos de Nómina</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/nomina/periodos/nuevo">Nuevo Período</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Vacaciones" id="vacaciones-dropdown">
                  <NavDropdown.Item as={Link} to="/vacaciones/solicitudes">Solicitudes</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Liquidaciones" id="liquidaciones-dropdown">
                  <NavDropdown.Item as={Link} to="/liquidaciones">Liquidaciones</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/liquidaciones/nueva">Nueva Liquidación</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Reportes" id="reportes-dropdown">
                  <NavDropdown.Item as={Link} to="/reportes/nomina">Reporte de Nómina</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reportes/marcajes">Reporte de Marcajes</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reportes/vacaciones">Reporte de Vacaciones</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            
            {!isAdmin() && (
              <>
            <Nav.Link as={Link} to="/marcajes">Marcajes</Nav.Link>
                <Nav.Link as={Link} to="/nomina/mi-historial">Mi Nómina</Nav.Link>
                <NavDropdown title="Mis Vacaciones" id="vacaciones-dropdown">
                  <NavDropdown.Item as={Link} to="/vacaciones/mis-solicitudes">Mis Solicitudes</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/vacaciones/solicitar">Solicitar Vacaciones</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
          
          {user && (
            <Nav>
              <NavDropdown title={`${user.nombre} ${user.apellido}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cambiar-password">Cambiar Contraseña</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;