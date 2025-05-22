import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { getNominaById } from '../../services/nominaService';

moment.locale('es');

const DetalleNomina = () => {
  const { id } = useParams();
  const [nomina, setNomina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNomina = async () => {
      try {
        const resultado = await getNominaById(id);
        
        if (resultado.success) {
          setNomina(resultado.data);
        } else {
          setError(resultado.message || 'Error al cargar la información de la nómina');
        }
      } catch (error) {
        console.error('Error al cargar nómina:', error);
        setError('Error al cargar la información de la nómina');
      } finally {
        setLoading(false);
      }
    };

    fetchNomina();
  }, [id]);

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
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!nomina) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo cargar la información de la nómina'}
        </Alert>
        <Button as={Link} to="/nomina/periodos" variant="primary">
          Volver a la lista de períodos
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Detalle de Nómina</h1>
      
      <Card className="mb-4">
        <Card.Header as="h5">Información General</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Empleado:</dt>
                <dd className="col-sm-8">{nomina.nombre_empleado}</dd>
                
                <dt className="col-sm-4">Código:</dt>
                <dd className="col-sm-8">{nomina.codigo_empleado}</dd>
                
                <dt className="col-sm-4">Período:</dt>
                <dd className="col-sm-8">{getTipoPeriodo(nomina.tipo_periodo)}</dd>
                
                <dt className="col-sm-4">Fecha Inicio:</dt>
                <dd className="col-sm-8">{moment(nomina.fecha_inicio).format('DD/MM/YYYY')}</dd>
                
                <dt className="col-sm-4">Fecha Fin:</dt>
                <dd className="col-sm-8">{moment(nomina.fecha_fin).format('DD/MM/YYYY')}</dd>
              </dl>
            </Col>
            
            <Col md={6}>
              <dl className="row">
                <dt className="col-sm-4">Estado:</dt>
                <dd className="col-sm-8">{getEstadoBadge(nomina.estado)}</dd>
                
                {nomina.fecha_pago && (
                  <>
                    <dt className="col-sm-4">Fecha Pago:</dt>
                    <dd className="col-sm-8">{moment(nomina.fecha_pago).format('DD/MM/YYYY')}</dd>
                  </>
                )}
                
                <dt className="col-sm-4">Salario Base:</dt>
                <dd className="col-sm-8">Q {Number(nomina.salario_base).toFixed(2)}</dd>
                
                <dt className="col-sm-4">Horas Trabajadas:</dt>
                <dd className="col-sm-8">{Number(nomina.horas_trabajadas).toFixed(2)}</dd>
                
                <dt className="col-sm-4">Salario Devengado:</dt>
                <dd className="col-sm-8">Q {Number(nomina.salario_devengado).toFixed(2)}</dd>
              </dl>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={6}>
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
                  {nomina.deducciones && nomina.deducciones.length > 0 ? (
                    nomina.deducciones.map((deduccion) => (
                      <tr key={deduccion.id_deduccion_nomina}>
                        <td>{deduccion.nombre}</td>
                        <td className="text-end">Q {Number(deduccion.monto).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No hay deducciones registradas
                      </td>
                    </tr>
                  )}
                  <tr className="table-secondary">
                    <th>Total Deducciones</th>
                    <th className="text-end">Q {Number(nomina.total_deducciones).toFixed(2)}</th>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Bonificaciones</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {nomina.bonificaciones && nomina.bonificaciones.length > 0 ? (
                    nomina.bonificaciones.map((bonificacion) => (
                      <tr key={bonificacion.id_bonificacion_nomina}>
                        <td>{bonificacion.nombre}</td>
                        <td className="text-end">Q {Number(bonificacion.monto).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No hay bonificaciones registradas
                      </td>
                    </tr>
                  )}
                  <tr className="table-secondary">
                    <th>Total Bonificaciones</th>
                    <th className="text-end">Q {Number(nomina.total_bonificaciones).toFixed(2)}</th>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Header as="h5" className="bg-primary text-white">Resumen</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Salario Devengado</th>
                    <td className="text-end">Q {Number(nomina.salario_devengado).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Total Deducciones</th>
                    <td className="text-end">- Q {Number(nomina.total_deducciones).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Total Bonificaciones</th>
                    <td className="text-end">+ Q {Number(nomina.total_bonificaciones).toFixed(2)}</td>
                  </tr>
                  <tr className="table-primary">
                    <th>Sueldo Líquido</th>
                    <th className="text-end">Q {Number(nomina.sueldo_liquido).toFixed(2)}</th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-end gap-2">
        <Button as={Link} to={`/nomina/periodos/${nomina.id_periodo}/nominas`} variant="secondary">
          Volver a la lista
        </Button>
        {nomina.estado === 'PENDIENTE' && (
          <Button as={Link} to={`/nomina/nominas/${nomina.id_nomina}/pagar`} variant="success">
            Pagar Nómina
          </Button>
        )}
      </div>
    </Container>
  );
};

export default DetalleNomina;