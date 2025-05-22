import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { solicitarVacaciones, getMisPeriodosVacacionales } from '../../services/vacacionesService';

moment.locale('es');

const validationSchema = Yup.object().shape({
  fecha_inicio: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .min(moment().add(1, 'days').format('YYYY-MM-DD'), 'La fecha de inicio debe ser futura'),
  fecha_fin: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(
      Yup.ref('fecha_inicio'),
      'La fecha de fin debe ser posterior a la fecha de inicio'
    ),
  observaciones: Yup.string()
});

const SolicitarVacaciones = () => {
  const navigate = useNavigate();
  const [periodos, setPeriodos] = useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diasCalculados, setDiasCalculados] = useState(0);

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const resultado = await getMisPeriodosVacacionales();
        
        if (resultado.success) {
          setPeriodos(resultado.data);
          
          // Calcular total de días disponibles
          const totalDisponibles = resultado.data.reduce((total, periodo) => {
            return total + (periodo.estado === 'ACTIVO' ? periodo.dias_pendientes : 0);
          }, 0);
          
          setDiasDisponibles(totalDisponibles);
        } else {
          setError(resultado.message || 'Error al cargar los períodos vacacionales');
        }
      } catch (error) {
        console.error('Error al cargar períodos:', error);
        setError('Error al cargar los períodos vacacionales');
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodos();
  }, []);

  const calcularDiasSolicitados = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;
    
    const inicio = moment(fechaInicio);
    const fin = moment(fechaFin);
    
    if (!inicio.isValid() || !fin.isValid() || fin.isBefore(inicio)) return 0;
    
    // Calcular días hábiles (excluyendo fines de semana)
    let dias = 0;
    let current = inicio.clone();
    
    while (current.isSameOrBefore(fin)) {
      // No contar sábados (6) ni domingos (0)
      if (current.day() !== 0 && current.day() !== 6) {
        dias++;
      }
      current.add(1, 'days');
    }
    
    return dias;
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (diasCalculados > diasDisponibles) {
        setStatus({ error: `No tiene suficientes días disponibles. Solicitados: ${diasCalculados}, Disponibles: ${diasDisponibles}` });
        return;
      }
      
      const resultado = await solicitarVacaciones(values);
      
      if (resultado.success) {
        navigate('/vacaciones/mis-solicitudes');
      } else {
        setStatus({ error: resultado.message || 'Error al solicitar vacaciones' });
      }
    } catch (error) {
      console.error('Error al solicitar vacaciones:', error);
      setStatus({ error: error.message || 'Error al solicitar vacaciones' });
    } finally {
      setSubmitting(false);
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

  return (
    <Container>
      <h1 className="mb-4">Solicitar Vacaciones</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Días Disponibles</Card.Header>
        <Card.Body>
          <Alert variant="info">
            <strong>Días de vacaciones disponibles:</strong> {diasDisponibles}
          </Alert>
          
          {diasDisponibles === 0 && (
            <Alert variant="warning">
              No tiene días de vacaciones disponibles. No podrá realizar una solicitud.
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header as="h5">Nueva Solicitud</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              fecha_inicio: '',
              fecha_fin: '',
              observaciones: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              status
            }) => {
              // Calcular días cada vez que cambian las fechas
              useEffect(() => {
                const dias = calcularDiasSolicitados(values.fecha_inicio, values.fecha_fin);
                setDiasCalculados(dias);
              }, [values.fecha_inicio, values.fecha_fin]);
              
              return (
                <Form onSubmit={handleSubmit}>
                  {status && status.error && (
                    <Alert variant="danger">{status.error}</Alert>
                  )}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                          type="date"
                          name="fecha_inicio"
                          value={values.fecha_inicio}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.fecha_inicio && errors.fecha_inicio}
                          min={moment().add(1, 'days').format('YYYY-MM-DD')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fecha_inicio}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Fin</Form.Label>
                        <Form.Control
                          type="date"
                          name="fecha_fin"
                          value={values.fecha_fin}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.fecha_fin && errors.fecha_fin}
                          min={values.fecha_inicio || moment().add(1, 'days').format('YYYY-MM-DD')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fecha_fin}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {values.fecha_inicio && values.fecha_fin && (
                    <Alert variant={diasCalculados <= diasDisponibles ? 'success' : 'danger'} className="mb-3">
                      <strong>Días hábiles solicitados:</strong> {diasCalculados}
                      {diasCalculados > diasDisponibles && (
                        <div className="mt-2">
                          <strong>¡Atención!</strong> Está solicitando más días de los que tiene disponibles.
                        </div>
                      )}
                    </Alert>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="observaciones"
                      value={values.observaciones}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.observaciones && errors.observaciones}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.observaciones}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/vacaciones/mis-solicitudes')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || diasCalculados === 0 || diasCalculados > diasDisponibles || diasDisponibles === 0}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SolicitarVacaciones;