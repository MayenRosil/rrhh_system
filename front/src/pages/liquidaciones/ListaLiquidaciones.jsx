import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaMoneyBillWave, FaPlus } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getAllLiquidaciones } from '../../services/liquidacionService';

moment.locale('es');

const ListaLiquidaciones = () => {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    const fetchLiquidaciones = async () => {
      try {
        setLoading(true);
        const resultado = await getAllLiquidaciones();
        
        if (resultado.success) {
          setLiquidaciones(resultado.data);
        } else {
          setError(resultado.message || 'Error al cargar las liquidaciones');
        }
      } catch (error) {
        console.error('Error al cargar liquidaciones:', error);
        setError('Error al cargar las liquidaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidaciones();
  }, []);

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
        <h1>Liquidaciones</h1>
        <Button as={Link} to="/liquidaciones/nueva" variant="primary">
          <FaPlus className="me-2" />
          Nueva Liquidación
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Fecha Liquidación</th>
            <th>Motivo</th>
            <th>Años Laborados</th>
            <th>Total Liquidación</th>
            <th>Estado</th>
            <th>Fecha Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {liquidaciones.length > 0 ? (
            liquidaciones.map((liquidacion) => (
              <tr key={liquidacion.id_liquidacion}>
                <td>{liquidacion.nombre_empleado}</td>
                <td>{moment(liquidacion.fecha_liquidacion).format('DD/MM/YYYY')}</td>
                <td>{getMotivoBadge(liquidacion.motivo)}</td>
                <td>{Number(liquidacion.anos_laborados).toFixed(2)}</td>
                <td><strong>Q {Number(liquidacion.total_liquidacion).toFixed(2)}</strong></td>
                <td>{getEstadoBadge(liquidacion.estado)}</td>
                <td>{liquidacion.fecha_pago ? moment(liquidacion.fecha_pago).format('DD/MM/YYYY') : '-'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      as={Link}
                      to={`/liquidaciones/${liquidacion.id_liquidacion}`}
                      title="Ver Detalle"
                    >
                      <FaEye />
                    </Button>
                    
                    {liquidacion.estado === 'CALCULADO' && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        as={Link}
                        to={`/liquidaciones/${liquidacion.id_liquidacion}/pagar`}
                        title="Pagar Liquidación"
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
              <td colSpan="8" className="text-center">
                No se encontraron liquidaciones
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaLiquidaciones;