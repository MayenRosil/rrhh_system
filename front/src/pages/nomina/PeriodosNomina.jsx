import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Badge, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaPlay, FaMoneyBillWave } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getPeriodos, procesarPeriodo } from '../../services/nominaService';

moment.locale('es');

const PeriodosNomina = () => {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      setLoading(true);
      const resultado = await getPeriodos();
      if (resultado.success) {
        setPeriodos(resultado.data);
      } else {
        setError(resultado.message || 'Error al cargar los períodos de nómina');
      }
    } catch (error) {
      console.error('Error al cargar períodos:', error);
      setError('Error al cargar los períodos de nómina');
    } finally {
      setLoading(false);
    }
  };

  const handleProcesarPeriodo = (periodo) => {
    setPeriodoSeleccionado(periodo);
    setShowModal(true);
  };

  const confirmarProcesamiento = async () => {
    try {
      setProcesando(true);
      const resultado = await procesarPeriodo(periodoSeleccionado.id_periodo);

      if (resultado.success) {
        // Actualizar estado del período
        const updatedPeriodos = periodos.map(p =>
          p.id_periodo === periodoSeleccionado.id_periodo
            ? { ...p, estado: 'PROCESADO' }
            : p
        );

        setPeriodos(updatedPeriodos);
        setShowModal(false);

        // Mostrar mensaje de éxito
        alert('Período procesado exitosamente');
      } else {
        setError(resultado.message || 'Error al procesar el período');
      }
    } catch (error) {
      console.error('Error al procesar período:', error);
      setError('Error al procesar el período');
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'ABIERTO':
        return <Badge bg="success">Abierto</Badge>;
      case 'CERRADO':
        return <Badge bg="secondary">Cerrado</Badge>;
      case 'PROCESADO':
        return <Badge bg="primary">Procesado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const getTipoPeriodo = (tipo) => {
    switch (tipo) {
      case 'SEMANAL':
        return 'Semanal';
      case 'QUINCENAL':
        return 'Quincenal';
      case 'MENSUAL':
        return 'Mensual';
      default:
        return tipo;
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Períodos de Nómina</h1>
        <Button as={Link} to="/nomina/periodos/nuevo" variant="primary">Nuevo Período</Button>
      </div>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {periodos.length > 0 ? (
            [...periodos] 
              .sort((a, b) => b.id_periodo - a.id_periodo)
              .map((periodo) => (
                <tr key={periodo.id_periodo}>
                  <td>{getTipoPeriodo(periodo.tipo)}</td>
                  <td>{moment(periodo.fecha_inicio).format('DD/MM/YYYY')}</td>
                  <td>{moment(periodo.fecha_fin).format('DD/MM/YYYY')}</td>
                  <td>{getEstadoBadge(periodo.estado)}</td>
                  <td>{moment(periodo.fecha_creacion).format('DD/MM/YYYY')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        as={Link}
                        to={`/nomina/periodos/${periodo.id_periodo}/nominas`}
                        title="Ver Nóminas"
                      >
                        <FaEye />
                      </Button>

                      {periodo.estado === 'ABIERTO' && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleProcesarPeriodo(periodo)}
                          title="Procesar Período"
                        >
                          <FaPlay />
                        </Button>
                      )}

                      {periodo.estado === 'PROCESADO' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          as={Link}
                          to={`/reportes/nomina/${periodo.id_periodo}`}
                          title="Generar Reporte"
                        >
                          <FaMoneyBillWave />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron períodos de nómina
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Procesar Período de Nómina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {periodoSeleccionado && (
            <>
              <p>¿Está seguro que desea procesar el siguiente período?</p>
              <p><strong>Tipo:</strong> {getTipoPeriodo(periodoSeleccionado.tipo)}</p>
              <p><strong>Fecha Inicio:</strong> {moment(periodoSeleccionado.fecha_inicio).format('DD/MM/YYYY')}</p>
              <p><strong>Fecha Fin:</strong> {moment(periodoSeleccionado.fecha_fin).format('DD/MM/YYYY')}</p>
              <Alert variant="warning">
                <strong>Advertencia:</strong> Esta acción calculará la nómina para todos los empleados y no podrá ser revertida.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={procesando}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarProcesamiento} disabled={procesando}>
            {procesando ? 'Procesando...' : 'Procesar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PeriodosNomina;