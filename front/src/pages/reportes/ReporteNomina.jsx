import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Table, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/es';
import { useReactToPrint } from 'react-to-print';
import { getReporteNominaPeriodo } from '../../services/reportesService';

moment.locale('es');

const ReporteNomina = () => {
  const { id } = useParams();
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reporteRef = useRef();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const resultado = await getReporteNominaPeriodo(id);
        
        if (resultado.success) {
          setReporteData(resultado.data);
        } else {
          setError(resultado.message || 'Error al generar el reporte');
        }
      } catch (error) {
        console.error('Error al generar reporte:', error);
        setError('Error al generar el reporte');
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => reporteRef.current,
    documentTitle: `Reporte_Nomina_${id}_${moment().format('YYYYMMDD')}`,
  });

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

  if (!reporteData) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo generar el reporte'}
        </Alert>
        <Button as={Link} to="/nomina/periodos" variant="primary">
          Volver a períodos
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reporte de Nómina</h1>
        <div className="d-flex gap-2">
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
      </div>
      
      <div ref={reporteRef} className="p-3">
        <div className="report-header text-center mb-4">
          <h2 className="report-title">Reporte de Nómina</h2>
          <p className="report-subtitle">Período {getTipoPeriodo(reporteData.periodo.tipo)}</p>
          <p>
            Del {moment(reporteData.periodo.fecha_inicio).format('LL')} al {moment(reporteData.periodo.fecha_fin).format('LL')}
          </p>
        </div>
        
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <dl className="row">
                  <dt className="col-sm-4">Tipo de Período:</dt>
                  <dd className="col-sm-8">{getTipoPeriodo(reporteData.periodo.tipo)}</dd>
                </dl>
              </Col>
              <Col md={6}>
                <dl className="row">
                  <dt className="col-sm-4">Total de Empleados:</dt>
                  <dd className="col-sm-8">{reporteData.totales.total_empleados}</dd>
                </dl>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Table striped bordered hover responsive className="report-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Empleado</th>
              <th>Departamento</th>
              <th>Puesto</th>
              <th>Salario Base</th>
              <th>Deducciones</th>
              <th>Bonificaciones</th>
              <th>Sueldo Líquido</th>
            </tr>
          </thead>
          <tbody>
            {reporteData.nominas.length > 0 ? (
              reporteData.nominas.map((nomina) => (
                <tr key={nomina.id_nomina}>
                  <td>{nomina.codigo_empleado}</td>
                  <td>{nomina.nombre_empleado}</td>
                  <td>{nomina.departamento}</td>
                  <td>{nomina.puesto}</td>
                  <td className="text-end">Q {Number(nomina.salario_base).toFixed(2)}</td>
                  <td className="text-end">Q {Number(nomina.total_deducciones).toFixed(2)}</td>
                  <td className="text-end">Q {Number(nomina.total_bonificaciones).toFixed(2)}</td>
                  <td className="text-end">Q {Number(nomina.sueldo_liquido).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="table-primary">
              <th colSpan="4" className="text-end">TOTALES:</th>
              <th className="text-end">Q {Number(reporteData.totales.total_salario_base).toFixed(2)}</th>
              <th className="text-end">Q {Number(reporteData.totales.total_deducciones).toFixed(2)}</th>
              <th className="text-end">Q {Number(reporteData.totales.total_bonificaciones).toFixed(2)}</th>
              <th className="text-end">Q {Number(reporteData.totales.total_sueldo_liquido).toFixed(2)}</th>
            </tr>
          </tfoot>
        </Table>
        
        <div className="mt-5 text-center">
          <p>Generado el {moment().format('LL')} a las {moment().format('LT')}</p>
        </div>
      </div>
    </Container>
  );
};

export default ReporteNomina;