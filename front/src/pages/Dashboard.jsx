import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { registrarEntrada, registrarSalida, getMisMarcajes } from '../services/marcajeService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [marcajes, setMarcajes] = useState([]);
  const [lastMarcaje, setLastMarcaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarcajes = async () => {
      try {
        const fechaHoy = moment().format('YYYY-MM-DD');
        const resultado = await getMisMarcajes(fechaHoy, fechaHoy);
        if (resultado.success) {
          setMarcajes(resultado.data);
          
          // Verificar si hay marcaje sin salida
          const marcajeSinSalida = resultado.data.find(m => !m.hora_salida);
          if (marcajeSinSalida) {
            setLastMarcaje(marcajeSinSalida);
            setEntradaRegistrada(true);
            setSalidaRegistrada(false);
          } else if (resultado.data.length > 0) {
            // El último marcaje tiene entrada y salida
            setLastMarcaje(resultado.data[0]);
            setEntradaRegistrada(true);
            setSalidaRegistrada(true);
          } else {
            // No hay marcajes hoy
            setLastMarcaje(null);
            setEntradaRegistrada(false);
            setSalidaRegistrada(false);
          }
        }
      } catch (error) {
        console.error('Error al cargar marcajes:', error);
        setError('Error al cargar los marcajes');
      } finally {
        setLoading(false);
      }
    };

    fetchMarcajes();
  }, []);

  const handleRegistrarEntrada = async () => {
    setError(null);
    try {
      const resultado = await registrarEntrada();
      if (resultado.success) {
        setEntradaRegistrada(true);
        setLastMarcaje({
          ...resultado,
          hora_entrada: new Date(),
          hora_salida: null
        });
        
        // Mostrar mensaje de éxito
        alert('Entrada registrada exitosamente');
      } else {
        setError(resultado.message || 'Error al registrar entrada');
      }
    } catch (error) {
      console.error('Error al registrar entrada:', error);
      setError('Error al registrar entrada');
    }
  };

  const handleRegistrarSalida = async () => {
    setError(null);
    try {
      const resultado = await registrarSalida();
      if (resultado.success) {
        setEntradaRegistrada(true);
        setSalidaRegistrada(true);
        setLastMarcaje({
          ...lastMarcaje,
          hora_salida: new Date(),
          horas_trabajadas: resultado.horas_trabajadas
        });
        
        // Mostrar mensaje de éxito
        alert('Salida registrada exitosamente');
      } else {
        setError(resultado.message || 'Error al registrar salida');
      }
    } catch (error) {
      console.error('Error al registrar salida:', error);
      setError('Error al registrar salida');
    }
  };

  return (
    <Container>
      <h1 className="mb-4">¡Bienvenido, {user ? user.nombre : 'Usuario'}!</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Marcajes</Card.Header>
            <Card.Body>
              <p>Fecha actual: {moment().format('LL')}</p>
              <p>Hora actual: {moment().format('LT')}</p>
              
              {lastMarcaje && entradaRegistrada && !salidaRegistrada && (
                <div className="mb-3">
                  <p>
                    <strong>Última entrada:</strong> {moment(lastMarcaje.hora_entrada).format('LT')}
                  </p>
                </div>
              )}
              
              {lastMarcaje && entradaRegistrada && salidaRegistrada && (
                <div className="mb-3">
                  <p>
                    <strong>Última entrada:</strong> {moment(lastMarcaje.hora_entrada).format('LT')}
                  </p>
                  <p>
                    <strong>Última salida:</strong> {moment(lastMarcaje.hora_salida).format('LT')}
                  </p>
                  <p>
                    <strong>Horas trabajadas:</strong> {Number(lastMarcaje.horas_trabajadas).toFixed(2)}
                  </p>
                </div>
              )}
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleRegistrarEntrada}
                  disabled={entradaRegistrada && !salidaRegistrada}
                >
                  Registrar Entrada
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleRegistrarSalida}
                  disabled={!entradaRegistrada || salidaRegistrada}
                >
                  Registrar Salida
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Información</Card.Header>
            <Card.Body>
              <p><strong>Nombre:</strong> {user ? `${user.nombre} ${user.apellido}` : ''}</p>
              <p><strong>Código de Empleado:</strong> {user ? user.codigo : ''}</p>
              <p><strong>Rol:</strong> {user ? user.rol : ''}</p>
              
              {isAdmin() ? (
                <div className="d-grid gap-2 mt-3">
                  <Button variant="outline-primary" href="/empleados">
                    Gestionar Empleados
                  </Button>
                  <Button variant="outline-primary" href="/nomina/periodos">
                    Gestionar Nómina
                  </Button>
                </div>
              ) : (
                <div className="d-grid gap-2 mt-3">
                  <Button variant="outline-primary" href="/nomina/mi-historial">
                    Ver Mi Nómina
                  </Button>
                  <Button variant="outline-primary" href="/vacaciones/mis-solicitudes">
                    Mis Solicitudes de Vacaciones
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;