import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaFileDownload } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { getMiHistorialNominas } from '../../services/nominaService';

moment.locale('es');

const MiHistorialNomina = () => {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNominas = async () => {
      try {
        const resultado = await getMiHistorialNominas();

        if (resultado.success) {
          setNominas(resultado.data);
        } else {
          setError(resultado.message || 'Error al cargar el historial de nóminas');
        }
      } catch (error) {
        console.error('Error al cargar nóminas:', error);
        setError('Error al cargar el historial de nóminas');
      } finally {
        setLoading(false);
      }
    };

    fetchNominas();
  }, []);

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

  return (
    <Container>
      <h1 className="mb-4">Mi Historial de Nómina</h1>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Período</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Salario Devengado</th>
                <th>Deducciones</th>
                <th>Bonificaciones</th>
                <th>Sueldo Líquido</th>
                <th>Estado</th>
                <th>Fecha Pago</th>
              </tr>
            </thead>
            <tbody>
              {nominas.length > 0 ? (
                nominas.map((nomina) => (
                  <tr key={nomina.id_nomina}>
                    <td>{getTipoPeriodo(nomina.tipo_periodo)}</td>
                    <td>{moment(nomina.fecha_inicio).format('DD/MM/YYYY')}</td>
                    <td>{moment(nomina.fecha_fin).format('DD/MM/YYYY')}</td>
                    <td>Q {Number(nomina.salario_devengado).toFixed(2)}</td>
                    <td>Q {Number(nomina.total_deducciones).toFixed(2)}</td>
                    <td>Q {Number(nomina.total_bonificaciones).toFixed(2)}</td>
                    <td><strong>Q {Number(nomina.sueldo_liquido).toFixed(2)}</strong></td>
                    <td>{getEstadoBadge(nomina.estado)}</td>
                    <td>{nomina.fecha_pago ? moment(nomina.fecha_pago).format('DD/MM/YYYY') : '-'}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No se encontraron registros de nómina
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

export default MiHistorialNomina;