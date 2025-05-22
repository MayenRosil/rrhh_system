import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col, Card, Alert, Badge, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getAllMarcajes, updateEstadoMarcaje } from '../../services/marcajeService';
import { getAllEmpleados } from '../../services/empleadoService';

moment.locale('es');

const GestionMarcajes = () => {
  const [marcajes, setMarcajes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [filteredMarcajes, setFilteredMarcajes] = useState([]);
  
  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [modalMarcaje, setModalMarcaje] = useState(null);
  const [modalEstado, setModalEstado] = useState('');
  const [modalObservaciones, setModalObservaciones] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (marcajes.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marcajes, selectedEmpleado]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [marcajesRes, empleadosRes] = await Promise.all([
        getAllMarcajes(fechaInicio, fechaFin),
        getAllEmpleados()
      ]);
      
      if (marcajesRes.success) {
        setMarcajes(marcajesRes.data);
        setFilteredMarcajes(marcajesRes.data);
      } else {
        setError(marcajesRes.message || 'Error al cargar los marcajes');
      }
      
      if (empleadosRes.success) {
        setEmpleados(empleadosRes.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  const applyFilters = () => {
    let filtered = [...marcajes];
    
    if (selectedEmpleado) {
      filtered = filtered.filter(m => m.id_empleado === parseInt(selectedEmpleado, 10));
    }
    
    setFilteredMarcajes(filtered);
  };

  const openModal = (marcaje, tipo) => {
    setModalMarcaje(marcaje);
    setModalEstado(tipo === 'aprobar' ? 'APROBADO' : 'RECHAZADO');
    setModalObservaciones('');
    setShowModal(true);
  };

  const handleUpdateEstado = async () => {
    try {
      const resultado = await updateEstadoMarcaje(
        modalMarcaje.id_marcaje, 
        modalEstado, 
        modalObservaciones
      );
      
      if (resultado.success) {
        // Actualizar marcaje en la lista
        const updatedMarcajes = marcajes.map(m => 
          m.id_marcaje === modalMarcaje.id_marcaje
            ? { ...m, estado: modalEstado, observaciones: modalObservaciones }
            : m
        );
        
        setMarcajes(updatedMarcajes);
        setShowModal(false);
        
        // Mostrar mensaje de éxito
        alert('Marcaje actualizado exitosamente');
      } else {
        setError(resultado.message || 'Error al actualizar el marcaje');
      }
    } catch (error) {
      console.error('Error al actualizar marcaje:', error);
      setError('Error al actualizar el marcaje');
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Gestión de Marcajes</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Filtros</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Empleado</Form.Label>
                <Form.Select
                  value={selectedEmpleado}
                  onChange={(e) => setSelectedEmpleado(e.target.value)}
                >
                  <option value="">Todos los empleados</option>
                  {empleados.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                className="mb-3 w-100"
                onClick={handleFilter}
              >
                <FaSearch className="me-2" />
                Filtrar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Horas</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarcajes.length > 0 ? (
              filteredMarcajes.map((marcaje) => (
                <tr key={marcaje.id_marcaje}>
                  <td>{marcaje.nombre_empleado}</td>
                  <td>{moment(marcaje.fecha).format('DD/MM/YYYY')}</td>
                  <td>{marcaje.hora_entrada ? moment(marcaje.hora_entrada).format('LT') : '-'}</td>
                  <td>{marcaje.hora_salida ? moment(marcaje.hora_salida).format('LT') : '-'}</td>
                  <td>{marcaje.horas_trabajadas ? Number(marcaje.horas_trabajadas).toFixed(2) : '-'}</td>
                  <td>
                    {marcaje.estado === 'PENDIENTE' && <Badge bg="warning">Pendiente</Badge>}
                    {marcaje.estado === 'APROBADO' && <Badge bg="success">Aprobado</Badge>}
                    {marcaje.estado === 'RECHAZADO' && <Badge bg="danger">Rechazado</Badge>}
                  </td>
                  <td>{marcaje.observaciones || '-'}</td>
                  <td>
                    {marcaje.estado === 'PENDIENTE' && (
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => openModal(marcaje, 'aprobar')}
                          title="Aprobar"
                        >
                          <FaCheck />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openModal(marcaje, 'rechazar')}
                          title="Rechazar"
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No se encontraron marcajes con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      
      {/* Modal para aprobar/rechazar marcaje */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalEstado === 'APROBADO' ? 'Aprobar Marcaje' : 'Rechazar Marcaje'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMarcaje && (
            <>
              <p><strong>Empleado:</strong> {modalMarcaje.nombre_empleado}</p>
              <p><strong>Fecha:</strong> {moment(modalMarcaje.fecha).format('DD/MM/YYYY')}</p>
              <p>
                <strong>Entrada:</strong> {modalMarcaje.hora_entrada ? moment(modalMarcaje.hora_entrada).format('LT') : '-'}
              </p>
              <p>
                <strong>Salida:</strong> {modalMarcaje.hora_salida ? moment(modalMarcaje.hora_salida).format('LT') : '-'}
              </p>
              <p>
                <strong>Horas:</strong> {modalMarcaje.horas_trabajadas ? Number(modalMarcaje.horas_trabajadas).toFixed(2) : '-'}
              </p>
              
              <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={modalObservaciones}
                  onChange={(e) => setModalObservaciones(e.target.value)}
                  required={modalEstado === 'RECHAZADO'}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant={modalEstado === 'APROBADO' ? 'success' : 'danger'}
            onClick={handleUpdateEstado}
            disabled={modalEstado === 'RECHAZADO' && !modalObservaciones}
          >
            {modalEstado === 'APROBADO' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionMarcajes;