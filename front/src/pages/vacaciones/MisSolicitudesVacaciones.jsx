import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getMisSolicitudesVacaciones, getMisPeriodosVacacionales } from '../../services/vacacionesService';

moment.locale('es');

const MisSolicitudesVacaciones = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solicitudesRes, periodosRes] = await Promise.all([
          getMisSolicitudesVacaciones(),
          getMisPeriodosVacacionales()
        ]);
        
        if (solicitudesRes.success) {
          setSolicitudes(solicitudesRes.data);
        }
        
        if (periodosRes.success) {
          setPeriodos(periodosRes.data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Solicitudes de Vacaciones</h1>
        <Button as={Link} to="/vacaciones/solicitar" variant="primary">
          <FaPlus className="me-2" />
          Nueva Solicitud
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Mis Períodos Vacacionales</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
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
                    <td><strong>{periodo.dias_pendientes}</strong></td>
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
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header as="h5">Historial de Solicitudes</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha Solicitud</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length > 0 ? (
                solicitudes.map((solicitud) => (
                  <tr key={solicitud.id_vacacion}>
                    <td>{moment(solicitud.fecha_creacion).format('DD/MM/YYYY')}</td>
                    <td>{moment(solicitud.fecha_inicio).format('DD/MM/YYYY')}</td>
                    <td>{moment(solicitud.fecha_fin).format('DD/MM/YYYY')}</td>
                    <td>{solicitud.dias_tomados}</td>
                    <td>{getEstadoBadge(solicitud.estado)}</td>
                    <td>{solicitud.observaciones || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No se encontraron solicitudes de vacaciones
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MisSolicitudesVacaciones;