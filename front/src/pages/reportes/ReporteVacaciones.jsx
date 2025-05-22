import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Table, Spinner, Row, Col, Form, Badge } from 'react-bootstrap';
import { FaPrint, FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { useReactToPrint } from 'react-to-print';
import { getReporteVacacionesDepartamento } from '../../services/reportesService';
import api from '../../services/api';

moment.locale('es');

const ReporteVacaciones = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('year').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('year').format('YYYY-MM-DD'));
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [error, setError] = useState(null);
  const reporteRef = useRef();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await api.get('/departamentos');
        if (response.data.success) {
          setDepartamentos(response.data.data);
        } else {
          setError(response.data.message || 'Error al cargar los departamentos');
        }
      } catch (error) {
        console.error('Error al cargar departamentos:', error);
        setError('Error al cargar los departamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartamentos();
  }, []);

  const handleGenerarReporte = async () => {
    if (!selectedDepartamento) {
      setError('Debe seleccionar un departamento');
      return;
    }
    
    try {
      setLoadingReporte(true);
      const resultado = await getReporteVacacionesDepartamento(
        selectedDepartamento, 
        fechaInicio, 
        fechaFin,
        estadoFiltro
      );
      
      if (resultado.success) {
        setReporteData(resultado.data);
        setError(null);
      } else {
        setError(resultado.message || 'Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      setError('Error al generar el reporte');
    } finally {
      setLoadingReporte(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => reporteRef.current,
    documentTitle: `Reporte_Vacaciones_${moment().format('YYYYMMDD')}`,
  });

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
      <h1 className="mb-4">Reporte de Vacaciones</h1>
      
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
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Departamento</Form.Label>
                  <Form.Select
                    value={selectedDepartamento}
                    onChange={(e) => setSelectedDepartamento(e.target.value)}
                  >
                    <option value="">Seleccione un departamento...</option>
                    {departamentos.map((departamento) => (
                      <option 
                        key={departamento.id_departamento} 
                        value={departamento.id_departamento}
                      >
                        {departamento.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
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
              
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  className="w-100 mb-3" 
                  onClick={handleGenerarReporte}
                  disabled={!selectedDepartamento || loadingReporte}
                >
                  {loadingReporte ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Generar
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {reporteData && (
        <>
          <div className="d-flex justify-content-end mb-3 gap-2">
            <Button variant="primary" onClick={handlePrint}>
              <FaPrint className="me-2" />
              Imprimir
            </Button>
            <Button variant="success">
              <FaFileExcel className="me-2" />
              Excel
            </Button>
            <Button variant="danger">
              <FaFilePdf className="me-2" />
              PDF
            </Button>
          </div>
          
          <div ref={reporteRef} className="p-3">
            <div className="report-header text-center mb-4">
              <h2 className="report-title">Reporte de Vacaciones</h2>
              <p>Departamento: {reporteData.departamento}</p>
              <p>
                Del {moment(reporteData.fechaInicio).format('LL')} al {moment(reporteData.fechaFin).format('LL')}
                {reporteData.estado && ` - Estado: ${reporteData.estado}`}
              </p>
            </div>
            
            <h4 className="mt-4 mb-3">Resumen por Empleado</h4>
            <Table striped bordered hover responsive className="report-table mb-4">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Días Correspondientes</th>
                  <th>Días Tomados</th>
                  <th>Días Pendientes</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.resumenEmpleados.length > 0 ? (
                  reporteData.resumenEmpleados.map((empleado, index) => (
                    <tr key={index}>
                      <td>{empleado.nombre_empleado}</td>
                      <td className="text-center">{empleado.dias_correspondientes || 0}</td>
                      <td className="text-center">{empleado.dias_tomados || 0}</td>
                      <td className="text-center">{empleado.dias_pendientes || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay datos de empleados para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            
            <h4 className="mt-4 mb-3">Detalle de Solicitudes de Vacaciones</h4>
            <Table striped bordered hover responsive className="report-table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Puesto</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Días</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.vacaciones.length > 0 ? (
                  reporteData.vacaciones.map((vacacion, index) => (
                    <tr key={index}>
                      <td>{vacacion.nombre_empleado}</td>
                      <td>{vacacion.puesto}</td>
                      <td>{moment(vacacion.fecha_inicio).format('DD/MM/YYYY')}</td>
                      <td>{moment(vacacion.fecha_fin).format('DD/MM/YYYY')}</td>
                      <td className="text-center">{vacacion.dias_tomados}</td>
                      <td>{getEstadoBadge(vacacion.estado)}</td>
                      <td>{vacacion.observaciones || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay solicitudes de vacaciones para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            
            <div className="mt-5 text-center">
              <p>Generado el {moment().format('LL')} a las {moment().format('LT')}</p>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default ReporteVacaciones;