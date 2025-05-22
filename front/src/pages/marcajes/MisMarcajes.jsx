import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getMisMarcajes, registrarEntrada, registrarSalida } from '../../services/marcajeService';

moment.locale('es');

const MisMarcajes = () => {
  const [marcajes, setMarcajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [lastMarcaje, setLastMarcaje] = useState(null);
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false);

  useEffect(() => {
    fetchMarcajes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaInicio, fechaFin]);

  const fetchMarcajes = async () => {
    try {
      setLoading(true);
      const resultado = await getMisMarcajes(fechaInicio, fechaFin);
      if (resultado.success) {
        setMarcajes(resultado.data);
        
        // Verificar estado actual de marcaje
        const fechaHoy = moment().format('YYYY-MM-DD');
        const marcajesHoy = resultado.data.filter(m => moment(m.fecha).format('YYYY-MM-DD') === fechaHoy);
        
        if (marcajesHoy.length > 0) {
          const marcajeSinSalida = marcajesHoy.find(m => !m.hora_salida);
          if (marcajeSinSalida) {
            setLastMarcaje(marcajeSinSalida);
            setEntradaRegistrada(true);
            setSalidaRegistrada(false);
          } else {
            // El último marcaje tiene entrada y salida
            setLastMarcaje(marcajesHoy[0]);
            setEntradaRegistrada(true);
            setSalidaRegistrada(true);
          }
        } else {
          // No hay marcajes hoy
          setLastMarcaje(null);
          setEntradaRegistrada(false);
          setSalidaRegistrada(false);
        }
      } else {
        setError(resultado.message || 'Error al cargar los marcajes');
      }
    } catch (error) {
      console.error('Error al cargar marcajes:', error);
      setError('Error al cargar los marcajes');
    } finally {
      setLoading(false);
    }
  };

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
        
        // Actualizar lista de marcajes
        fetchMarcajes();
        
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
        
        // Actualizar lista de marcajes
        fetchMarcajes();
        
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
      <h1 className="mb-4">Mis Marcajes</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Registro de Marcaje</Card.Header>
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
          <Card>
            <Card.Header as="h5">Filtrar Marcajes</Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Fin</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-grid">
                <Button
                  variant="outline-primary"
                  onClick={fetchMarcajes}
                >
                  <FaCalendarAlt className="me-2" />
                  Filtrar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Horas</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {marcajes.length > 0 ? (
              marcajes.map((marcaje) => (
                <tr key={marcaje.id_marcaje}>
                  <td>{moment(marcaje.fecha).format('DD/MM/YYYY')}</td>
                  <td>{marcaje.hora_entrada ? moment(marcaje.hora_entrada).format('LT') : '-'}</td>
                  <td>{marcaje.hora_salida ? moment(marcaje.hora_salida).format('LT') : '-'}</td>
                  <td>{marcaje.horas_trabajadas ? Number(marcaje.horas_trabajadas).toFixed(2) : '-'}</td>
                  <td>
                    {marcaje.estado === 'PENDIENTE' && <span className="text-warning">Pendiente</span>}
                    {marcaje.estado === 'APROBADO' && <span className="text-success">Aprobado</span>}
                    {marcaje.estado === 'RECHAZADO' && <span className="text-danger">Rechazado</span>}
                  </td>
                  <td>{marcaje.observaciones || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron marcajes en el rango de fechas seleccionado
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MisMarcajes;