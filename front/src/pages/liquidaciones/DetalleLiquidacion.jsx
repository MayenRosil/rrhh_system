import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Table, Badge, Modal, Form } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaFileDownload } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getLiquidacionById, pagarLiquidacion } from '../../services/liquidacionService';

moment.locale('es');

const DetalleLiquidacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liquidacion, setLiquidacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para modal de pago
  const [showModal, setShowModal] = useState(false);
  const [fechaPago, setFechaPago] = useState(moment().format('YYYY-MM-DD'));
  const [observaciones, setObservaciones] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const fetchLiquidacion = async () => {
      try {
        const resultado = await getLiquidacionById(id);
        
        if (resultado.success) {
          setLiquidacion(resultado.data);
        } else {
          setError(resultado.message || 'Error al cargar la información de la liquidación');
        }
      } catch (error) {
        console.error('Error al cargar liquidación:', error);
        setError('Error al cargar la información de la liquidación');
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidacion();
  }, [id]);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'CALCULADO':
        return <Badge bg="primary">Calculado</Badge>;
      case 'PAGADO':
        return <Badge bg="success">Pagado</Badge>;
      case 'ANULADO':
        return <Badge bg="danger">Anulado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const getMotivoBadge = (motivo) => {
    switch (motivo) {
      case 'DESPIDO_JUSTIFICADO':
        return <Badge bg="danger">Despido Justificado</Badge>;
      case 'DESPIDO_INJUSTIFICADO':
        return <Badge bg="danger">Despido Injustificado</Badge>;
      case 'RENUNCIA':
        return <Badge bg="info">Renuncia</Badge>;
      case 'MUTUO_ACUERDO':
        return <Badge bg="warning">Mutuo Acuerdo</Badge>;
      case 'FALLECIMIENTO':
        return <Badge bg="dark">Fallecimiento</Badge>;
      default:
        return <Badge bg="secondary">{motivo}</Badge>;
    }
  };

  const handlePagarClick = () => {
    setFechaPago(moment().format('YYYY-MM-DD'));
    setObservaciones('');
    setShowModal(true);
  };

  const confirmarPago = async () => {
    try {
      setProcesando(true);
      const resultado = await pagarLiquidacion(id, { fecha_pago: fechaPago, observaciones });
      
      if (resultado.success) {
        // Actualizar la liquidación
        const liquidacionActualizada = await getLiquidacionById(id);
        if (liquidacionActualizada.success) {
          setLiquidacion(liquidacionActualizada.data);
        }
        
        setShowModal(false);
        
        // Mostrar mensaje de éxito
        alert('Liquidación pagada exitosamente');
      } else {
        setError(resultado.message || 'Error al pagar la liquidación');
      }
    } catch (error) {
      console.error('Error al pagar liquidación:', error);
      setError('Error al pagar la liquidación');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!liquidacion) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo cargar la información de la liquidación'}
        </Alert>
        <Button as={Link} to="/liquidaciones" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Detalle de Liquidación</h1>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Información del Empleado</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Empleado:</dt>
                <dd className="col-sm-8">{liquidacion.nombre_empleado}</dd>
                
                <dt className="col-sm-4">Código:</dt>
                <dd className="col-sm-8">{liquidacion.codigo_empleado}</dd>
                
                <dt className="col-sm-4">DPI:</dt>
                <dd className="col-sm-8">{liquidacion.dpi}</dd>
              </dl>
            </Col>
            
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Fecha Contratación:</dt>
                <dd className="col-sm-8">{moment(liquidacion.fecha_contratacion).format('DD/MM/YYYY')}</dd>
                
                <dt className="col-sm-4">Fecha Fin:</dt>
                <dd className="col-sm-8">{moment(liquidacion.fecha_fin_contrato).format('DD/MM/YYYY')}</dd>
                
                <dt className="col-sm-4">Años Laborados:</dt>
                <dd className="col-sm-8">{Number(liquidacion.anos_laborados).toFixed(2)}</dd>
              </dl>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header as="h5">Información de la Liquidación</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Fecha Liquidación:</dt>
                <dd className="col-sm-8">{moment(liquidacion.fecha_liquidacion).format('DD/MM/YYYY')}</dd>
                
                <dt className="col-sm-4">Motivo:</dt>
                <dd className="col-sm-8">{getMotivoBadge(liquidacion.motivo)}</dd>
                
                <dt className="col-sm-4">Estado:</dt>
                <dd className="col-sm-8">{getEstadoBadge(liquidacion.estado)}</dd>
                
                {liquidacion.fecha_pago && (
                  <>
                    <dt className="col-sm-4">Fecha Pago:</dt>
                    <dd className="col-sm-8">{moment(liquidacion.fecha_pago).format('DD/MM/YYYY')}</dd>
                  </>
                )}
              </dl>
            </Col>
            
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Salario Promedio:</dt>
                <dd className="col-sm-8">Q {Number(liquidacion.salario_promedio).toFixed(2)}</dd>
                
                {liquidacion.observaciones && (
                  <>
                    <dt className="col-sm-4">Observaciones:</dt>
                    <dd className="col-sm-8">{liquidacion.observaciones}</dd>
                  </>
                )}
              </dl>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Header as="h5">Detalle de Montos</Card.Header>
            <Card.Body>
              <Table bordered>
                <tbody>
                  {liquidacion.indemnizacion > 0 && (
                    <tr>
                      <th>Indemnización:</th>
                      <td className="text-end">Q {Number(liquidacion.indemnizacion).toFixed(2)}</td>
                    </tr>
                  )}
                  
                  <tr>
                    <th>Aguinaldo Proporcional:</th>
                    <td className="text-end">Q {Number(liquidacion.aguinaldo_proporcional).toFixed(2)}</td>
                  </tr>
                  
                  <tr>
                    <th>Bono 14 Proporcional:</th>
                    <td className="text-end">Q {Number(liquidacion.bono14_proporcional).toFixed(2)}</td>
                  </tr>
                  
                  {liquidacion.vacaciones_pendientes > 0 && (
                    <tr>
                      <th>Vacaciones Pendientes:</th>
                      <td className="text-end">Q {Number(liquidacion.vacaciones_pendientes).toFixed(2)}</td>
                    </tr>
                  )}
                  
                  {liquidacion.otros_pagos > 0 && (
                    <tr>
                      <th>Otros Pagos:</th>
                      <td className="text-end">Q {Number(liquidacion.otros_pagos).toFixed(2)}</td>
                    </tr>
                  )}
                  
                  {liquidacion.total_deducciones > 0 && (
                    <tr>
                      <th>Total Deducciones:</th>
                      <td className="text-end text-danger">- Q {Number(liquidacion.total_deducciones).toFixed(2)}</td>
                    </tr>
                  )}
                  
                  <tr className="table-primary">
                    <th>Total Liquidación:</th>
                    <th className="text-end">Q {Number(liquidacion.total_liquidacion).toFixed(2)}</th>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        {liquidacion.deducciones && liquidacion.deducciones.length > 0 && (
          <Col md={5}>
            <Card className="mb-4">
              <Card.Header as="h5">Deducciones</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liquidacion.deducciones.map((deduccion) => (
                      <tr key={deduccion.id_deduccion_liquidacion}>
                        <td>{deduccion.nombre}</td>
                        <td className="text-end">Q {Number(deduccion.monto).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="table-secondary">
                      <th>Total Deducciones</th>
                      <th className="text-end">Q {Number(liquidacion.total_deducciones).toFixed(2)}</th>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      
      <div className="d-flex justify-content-end gap-2">
        <Button as={Link} to="/liquidaciones" variant="secondary">
          Volver a la lista
        </Button>
        
        {liquidacion.estado === 'CALCULADO' && (
          <Button variant="success" onClick={handlePagarClick}>
            <FaMoneyBillWave className="me-2" />
            Pagar Liquidación
          </Button>
        )}
        
        {liquidacion.estado === 'PAGADO' && (
          <Button variant="primary">
            <FaFileDownload className="me-2" />
            Descargar Comprobante
          </Button>
        )}
      </div>
      
      {/* Modal de Pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pagar Liquidación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea pagar la liquidación del empleado <strong>{liquidacion.nombre_empleado}</strong>?</p>
          <p><strong>Total a pagar:</strong> Q {Number(liquidacion.total_liquidacion).toFixed(2)}</p>
          
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Pago</Form.Label>
            <Form.Control
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              max={moment().format('YYYY-MM-DD')}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Form.Group>
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

export default DetalleLiquidacion;