import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Table, Spinner, Row, Col, Form } from 'react-bootstrap';
import { FaPrint, FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { useReactToPrint } from 'react-to-print';
import api from '../../services/api';

moment.locale('es');

const ReporteMarcajes = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().format('YYYY-MM-DD'));
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [error, setError] = useState(null);
  const reporteRef = useRef();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        setLoading(true);
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
      // Aquí normalmente llamaríamos a una API para generar el reporte
      // Por ahora solo simularemos datos
      setReporteData({
        departamento: departamentos.find(d => d.id_departamento.toString() === selectedDepartamento)?.nombre || 'No especificado',
        fechaInicio,
        fechaFin,
        resumenEmpleados: [
          { nombre_empleado: 'Empleado de Ejemplo 1', total_marcajes: 20, total_horas_aprobadas: 160.00 },
          { nombre_empleado: 'Empleado de Ejemplo 2', total_marcajes: 18, total_horas_aprobadas: 140.50 }
        ],
        marcajes: [
          { 
            nombre_empleado: 'Empleado de Ejemplo 1', 
            puesto: 'Analista',
            fecha: '2023-09-01',
            hora_entrada: '2023-09-01T08:00:00',
            hora_salida: '2023-09-01T17:00:00',
            horas_trabajadas: 9.00,
            estado: 'APROBADO'
          },
          { 
            nombre_empleado: 'Empleado de Ejemplo 2', 
            puesto: 'Desarrollador',
            fecha: '2023-09-02',
            hora_entrada: '2023-09-02T08:30:00',
            hora_salida: '2023-09-02T18:00:00',
            horas_trabajadas: 9.50,
            estado: 'APROBADO'
          }
        ]
      });
      setError(null);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      setError('Error al generar el reporte');
    } finally {
      setLoadingReporte(false);
    }
  };

  const handlePrint = () => {
    if (reporteRef.current) {
      window.print();
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
      <h1 className="mb-4">Reporte de Marcajes</h1>
      
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
              <Col md={4}>
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
              <h2 className="report-title">Reporte de Marcajes</h2>
              <p className="report-subtitle">Departamento: {reporteData.departamento}</p>
              <p>
                Del {moment(reporteData.fechaInicio).format('LL')} al {moment(reporteData.fechaFin).format('LL')}
              </p>
            </div>
            
            <h4 className="mt-4 mb-3">Resumen por Empleado</h4>
            <Table striped bordered hover responsive className="report-table mb-4">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Total de Marcajes</th>
                  <th>Total Horas Aprobadas</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.resumenEmpleados.length > 0 ? (
                  reporteData.resumenEmpleados.map((empleado, index) => (
                    <tr key={index}>
                      <td>{empleado.nombre_empleado}</td>
                      <td className="text-center">{empleado.total_marcajes}</td>
                      <td className="text-center">{Number(empleado.total_horas_aprobadas).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay datos de empleados para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            
            <h4 className="mt-4 mb-3">Detalle de Marcajes</h4>
            <Table striped bordered hover responsive className="report-table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Puesto</th>
                  <th>Fecha</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Horas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.marcajes.length > 0 ? (
                  reporteData.marcajes.map((marcaje, index) => (
                    <tr key={index}>
                      <td>{marcaje.nombre_empleado}</td>
                      <td>{marcaje.puesto}</td>
                      <td>{moment(marcaje.fecha).format('DD/MM/YYYY')}</td>
                      <td>{marcaje.hora_entrada ? moment(marcaje.hora_entrada).format('LT') : '-'}</td>
                      <td>{marcaje.hora_salida ? moment(marcaje.hora_salida).format('LT') : '-'}</td>
                      <td className="text-center">{marcaje.horas_trabajadas ? Number(marcaje.horas_trabajadas).toFixed(2) : '-'}</td>
                      <td>
                        {marcaje.estado === 'PENDIENTE' && <span className="text-warning">Pendiente</span>}
                        {marcaje.estado === 'APROBADO' && <span className="text-success">Aprobado</span>}
                        {marcaje.estado === 'RECHAZADO' && <span className="text-danger">Rechazado</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay marcajes para mostrar
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

export default ReporteMarcajes;