import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Badge, Modal, Form, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { 
  getSolicitudesVacaciones, 
  aprobarVacaciones, 
  rechazarVacaciones, 
  getPeriodosVacacionalesByEmpleado 
} from '../../services/vacacionesService';

moment.locale('es');

const GestionSolicitudesVacaciones = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para filtrar solicitudes
  const [estadoFiltro, setEstadoFiltro] = useState('SOLICITADO');
  
  // Estados para modal de aprobación/rechazo
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [procesando, setProcesando] = useState(false);
  
  // Estado para modal de detalle
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, [estadoFiltro]);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const resultado = await getSolicitudesVacaciones(estadoFiltro);
      
      if (resultado.success) {
        setSolicitudes(resultado.data);
      } else {
        setError(resultado.message || 'Error al cargar las solicitudes de vacaciones');
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al cargar las solicitudes de vacaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarClick = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalTipo('aprobar');
    setObservaciones('');
    setShowModal(true);
  };

  const handleRechazarClick = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalTipo('rechazar');
    setObservaciones('');
    setShowModal(true);
  };

  const handleDetalleClick = async (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowDetalleModal(true);
    
    try {
      setLoadingPeriodos(true);
      const resultado = await getPeriodosVacacionalesByEmpleado(solicitud.id_empleado);
      
      if (resultado.success) {
        setPeriodos(resultado.data);
      }
    } catch (error) {
      console.error('Error al cargar períodos vacacionales:', error);
    } finally {
      setLoadingPeriodos(false);
    }
  };

  const confirmarAccion = async () => {
    if (!solicitudSeleccionada) return;
    
    try {
      setProcesando(true);
      let resultado;
      
      if (modalTipo === 'aprobar') {
        resultado = await aprobarVacaciones(solicitudSeleccionada.id_vacacion);
      } else {
        resultado = await rechazarVacaciones(solicitudSeleccionada.id_vacacion, observaciones);
      }
      
      if (resultado.success) {
        // Actualizar lista de solicitudes
        fetchSolicitudes();
        setShowModal(false);
        
        // Mostrar mensaje de éxito
        alert(`Solicitud ${modalTipo === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente`);
      } else {
        setError(resultado.message || `Error al ${modalTipo} la solicitud`);
      }
    } catch (error) {
      console.error(`Error al ${modalTipo} solicitud:`, error);
      setError(`Error al ${modalTipo} la solicitud`);
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'SOLICITADO':
        return <Badge bg="primary">Solicitado</Badge>;
      case 'APROBADO':
        return <Badge bg="success">Aprobado</Badge>;
      case 'RECHAZADO':
        return <Badge bg="danger">Rechazado</Badge>;
      case 'CANCELADO':
        return <Badge bg="secondary">Cancelado</Badge>;
      case 'TERMINADO':
        return <Badge bg="info">Terminado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Gestión de Solicitudes de Vacaciones</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Filtros</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="SOLICITADO">Solicitado</option>
                    <option value="APROBADO">Aprobado</option>
                    <option value="RECHAZADO">Rechazado</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="TERMINADO">Terminado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Fecha Solicitud</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length > 0 ? (
                solicitudes.map((solicitud) => (
                  <tr key={solicitud.id_vacacion}>
                    <td>{solicitud.nombre_empleado}</td>
                    <td>{moment(solicitud.fecha_creacion).format('DD/MM/YYYY')}</td>
                    <td>{moment(solicitud.fecha_inicio).format('DD/MM/YYYY')}</td>
                    <td>{moment(solicitud.fecha_fin).format('DD/MM/YYYY')}</td>
                    <td>{solicitud.dias_tomados}</td>
                    <td>{getEstadoBadge(solicitud.estado)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleDetalleClick(solicitud)}
                          title="Ver Detalle"
                        >
                          <FaEye />
                        </Button>
                        
                        {solicitud.estado === 'SOLICITADO' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleAprobarClick(solicitud)}
                              title="Aprobar"
                            >
                              <FaCheck />
                            </Button>
                            
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRechazarClick(solicitud)}
                              title="Rechazar"
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron solicitudes de vacaciones
                    {estadoFiltro && ` con estado ${estadoFiltro}`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Modal de Aprobar/Rechazar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalTipo === 'aprobar' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solicitudSeleccionada && (
            <>
              <p><strong>Empleado:</strong> {solicitudSeleccionada.nombre_empleado}</p>
              <p><strong>Período:</strong> {moment(solicitudSeleccionada.fecha_inicio).format('DD/MM/YYYY')} - {moment(solicitudSeleccionada.fecha_fin).format('DD/MM/YYYY')}</p>
              <p><strong>Días solicitados:</strong> {solicitudSeleccionada.dias_tomados}</p>
              
              {solicitudSeleccionada.observaciones && (
                <p><strong>Observaciones del empleado:</strong> {solicitudSeleccionada.observaciones}</p>
              )}
              
              {modalTipo === 'rechazar' && (
                <Form.Group className="mb-3">
                  <Form.Label>Motivo de rechazo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={procesando}>
            Cancelar
          </Button>
          <Button 
            variant={modalTipo === 'aprobar' ? 'success' : 'danger'} 
            onClick={confirmarAccion} 
            disabled={procesando || (modalTipo === 'rechazar' && !observaciones)}
          >
            {procesando ? 'Procesando...' : modalTipo === 'aprobar' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal de Detalle */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solicitudSeleccionada && (
            <Tabs defaultActiveKey="solicitud" id="detalle-tabs">
              <Tab eventKey="solicitud" title="Solicitud">
                <Card className="mt-3">
                  <Card.Body>
                    <dl className="row">
                      <dt className="col-sm-4">Empleado:</dt>
                      <dd className="col-sm-8">{solicitudSeleccionada.nombre_empleado}</dd>
                      
                      <dt className="col-sm-4">Fecha de Solicitud:</dt>
                      <dd className="col-sm-8">{moment(solicitudSeleccionada.fecha_creacion).format('LL')}</dd>
                      
                      <dt className="col-sm-4">Período:</dt>
                      <dd className="col-sm-8">{moment(solicitudSeleccionada.fecha_inicio).format('LL')} - {moment(solicitudSeleccionada.fecha_fin).format('LL')}</dd>
                      
                      <dt className="col-sm-4">Días solicitados:</dt>
                      <dd className="col-sm-8">{solicitudSeleccionada.dias_tomados}</dd>
                      
                      <dt className="col-sm-4">Estado:</dt>
                      <dd className="col-sm-8">{getEstadoBadge(solicitudSeleccionada.estado)}</dd>
                      
                      {solicitudSeleccionada.observaciones && (
                        <>
                          <dt className="col-sm-4">Observaciones:</dt>
                          <dd className="col-sm-8">{solicitudSeleccionada.observaciones}</dd>
                        </>
                      )}
                    </dl>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="periodos" title="Períodos Vacacionales">
                {loadingPeriodos ? (
                  <div className="text-center my-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Período</th>
                        <th>Días Correspondientes</th>
                        <th>Días Tomados</th>
                        <th>Días Pendientes</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodos.length > 0 ? (
                        periodos.map((periodo) => (
                          <tr key={periodo.id_periodo_vacacional}>
                            <td>
                              {moment(periodo.fecha_inicio).format('DD/MM/YYYY')} - {moment(periodo.fecha_fin).format('DD/MM/YYYY')}
                            </td>
                            <td>{periodo.dias_correspondientes}</td>
                            <td>{periodo.dias_tomados}</td>
                            <td>{periodo.dias_pendientes}</td>
                            <td>
                              {periodo.estado === 'ACTIVO' && <Badge bg="success">Activo</Badge>}
                              {periodo.estado === 'CERRADO' && <Badge bg="secondary">Cerrado</Badge>}
                              {periodo.estado === 'LIQUIDADO' && <Badge bg="info">Liquidado</Badge>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No hay períodos vacacionales registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cerrar
          </Button>
          {solicitudSeleccionada && solicitudSeleccionada.estado === 'SOLICITADO' && (
            <>
              <Button 
                variant="success" 
                onClick={() => {
                  setShowDetalleModal(false);
                  handleAprobarClick(solicitudSeleccionada);
                }}
              >
                Aprobar
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  setShowDetalleModal(false);
                  handleRechazarClick(solicitudSeleccionada);
                }}
              >
                Rechazar
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionSolicitudesVacaciones;