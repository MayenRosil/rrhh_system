import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaEye, FaMoneyBillWave } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getPeriodoById, getNominasByPeriodo, pagarNomina } from '../../services/nominaService';

moment.locale('es');

const ListaNominas = () => {
  const { id } = useParams();
  const [periodo, setPeriodo] = useState(null);
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nominaSeleccionada, setNominaSeleccionada] = useState(null);
  const [fechaPago, setFechaPago] = useState(moment().format('YYYY-MM-DD'));
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [periodoRes, nominasRes] = await Promise.all([
        getPeriodoById(id),
        getNominasByPeriodo(id)
      ]);
      
      if (periodoRes.success) {
        setPeriodo(periodoRes.data);
      } else {
        setError(periodoRes.message || 'Error al cargar la información del período');
      }
      
      if (nominasRes.success) {
        setNominas(nominasRes.data);
      } else {
        setError(nominasRes.message || 'Error al cargar las nóminas');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handlePagarNomina = (nomina) => {
    setNominaSeleccionada(nomina);
    setFechaPago(moment().format('YYYY-MM-DD'));
    setShowModal(true);
  };

  const confirmarPago = async () => {
    try {
      setProcesando(true);
      const resultado = await pagarNomina(nominaSeleccionada.id_nomina, { fecha_pago: fechaPago });
      
      if (resultado.success) {
        // Actualizar estado de la nómina en la lista
        const updatedNominas = nominas.map(n => 
          n.id_nomina === nominaSeleccionada.id_nomina
            ? { ...n, estado: 'PAGADO', fecha_pago: fechaPago }
            : n
        );
        
        setNominas(updatedNominas);
        setShowModal(false);
        
        // Mostrar mensaje de éxito
        alert('Nómina pagada exitosamente');
      } else {
        setError(resultado.message || 'Error al pagar la nómina');
      }
    } catch (error) {
      console.error('Error al pagar nómina:', error);
      setError('Error al pagar la nómina');
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Badge bg="warning">Pendiente</Badge>;
      case 'PAGADO':
        return <Badge bg="success">Pagado</Badge>;
      case 'ANULADO':
        return <Badge bg="danger">Anulado</Badge>;
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

  if (!periodo) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo cargar la información del período'}
        </Alert>
        <Button as={Link} to="/nomina/periodos" variant="primary">
          Volver a la lista de períodos
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Nóminas del Período</h1>
      
      <div className="mb-4">
        <dl className="row">
          <dt className="col-sm-3">Tipo de Período:</dt>
          <dd className="col-sm-9">{getTipoPeriodo(periodo.tipo)}</dd>
          
          <dt className="col-sm-3">Fecha Inicio:</dt>
          <dd className="col-sm-9">{moment(periodo.fecha_inicio).format('LL')}</dd>
          
          <dt className="col-sm-3">Fecha Fin:</dt>
          <dd className="col-sm-9">{moment(periodo.fecha_fin).format('LL')}</dd>
          
          <dt className="col-sm-3">Estado:</dt>
          <dd className="col-sm-9">
            {periodo.estado === 'ABIERTO' && <Badge bg="success">Abierto</Badge>}
            {periodo.estado === 'CERRADO' && <Badge bg="secondary">Cerrado</Badge>}
            {periodo.estado === 'PROCESADO' && <Badge bg="primary">Procesado</Badge>}
          </dd>
        </dl>
      </div>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Empleado</th>
            <th>Salario Base</th>
            <th>Horas Trabajadas</th>
            <th>Deducciones</th>
            <th>Bonificaciones</th>
            <th>Sueldo Líquido</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nominas.length > 0 ? (
            nominas.map((nomina) => (
              <tr key={nomina.id_nomina}>
                <td>{nomina.codigo_empleado}</td>
                <td>{nomina.nombre_empleado}</td>
                <td>Q {Number(nomina.salario_base).toFixed(2)}</td>
                <td>{Number(nomina.horas_trabajadas).toFixed(2)}</td>
                <td>Q {Number(nomina.total_deducciones).toFixed(2)}</td>
                <td>Q {Number(nomina.total_bonificaciones).toFixed(2)}</td>
                <td><strong>Q {Number(nomina.sueldo_liquido).toFixed(2)}</strong></td>
                <td>{getEstadoBadge(nomina.estado)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      as={Link}
                      to={`/nomina/nominas/${nomina.id_nomina}`}
                      title="Ver Detalle"
                    >
                      <FaEye />
                    </Button>
                    
                    {nomina.estado === 'PENDIENTE' && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handlePagarNomina(nomina)}
                        title="Pagar Nómina"
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
              <td colSpan="9" className="text-center">
                No se encontraron nóminas para este período
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pagar Nómina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nominaSeleccionada && (
            <>
              <p>¿Está seguro que desea pagar la nómina del siguiente empleado?</p>
              <p><strong>Empleado:</strong> {nominaSeleccionada.nombre_empleado}</p>
              <p><strong>Sueldo Líquido:</strong> Q {Number(nominaSeleccionada.sueldo_liquido).toFixed(2)}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Pago</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={procesando}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmarPago} disabled={procesando}>
            {procesando ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaNominas;