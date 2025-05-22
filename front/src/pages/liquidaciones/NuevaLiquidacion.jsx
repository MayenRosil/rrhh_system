import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { getAllEmpleados } from '../../services/empleadoService';
import { calcularLiquidacion } from '../../services/liquidacionService';

moment.locale('es');

const validationSchema = Yup.object().shape({
  id_empleado: Yup.number()
    .required('El empleado es obligatorio'),
  fecha_liquidacion: Yup.date()
    .required('La fecha de liquidación es obligatoria')
    .max(new Date(), 'La fecha de liquidación no puede ser futura'),
  motivo: Yup.string()
    .required('El motivo es obligatorio')
    .oneOf([
      'DESPIDO_JUSTIFICADO',
      'DESPIDO_INJUSTIFICADO',
      'RENUNCIA',
      'MUTUO_ACUERDO',
      'FALLECIMIENTO'
    ], 'Motivo no válido')
});

const NuevaLiquidacion = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const resultado = await getAllEmpleados();
        
        if (resultado.success) {
          // Filtrar solo empleados activos
          const empleadosActivos = resultado.data.filter(emp => emp.estado === 'ACTIVO');
          setEmpleados(empleadosActivos);
        } else {
          setError(resultado.message || 'Error al cargar los empleados');
        }
      } catch (error) {
        console.error('Error al cargar empleados:', error);
        setError('Error al cargar los empleados');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const resultado = await calcularLiquidacion(values);
      
      if (resultado.success) {
        navigate(`/liquidaciones/${resultado.id}`);
      } else {
        setStatus({ error: resultado.message || 'Error al calcular la liquidación' });
      }
    } catch (error) {
      console.error('Error al calcular liquidación:', error);
      setStatus({ error: error.message || 'Error al calcular la liquidación' });
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
      <h1 className="mb-4">Nueva Liquidación</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card>
        <Card.Header as="h5">Cálculo de Liquidación</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              id_empleado: '',
              fecha_liquidacion: moment().format('YYYY-MM-DD'),
              motivo: ''
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
              status
            }) => (
              <Form onSubmit={handleSubmit}>
                {status && status.error && (
                  <Alert variant="danger">{status.error}</Alert>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Empleado</Form.Label>
                  <Form.Select
                    name="id_empleado"
                    value={values.id_empleado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.id_empleado && errors.id_empleado}
                  >
                    <option value="">Seleccione un empleado...</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id_empleado} value={empleado.id_empleado}>
                        {empleado.codigo_empleado} - {empleado.nombre} {empleado.apellido}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.id_empleado}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Liquidación</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha_liquidacion"
                        value={values.fecha_liquidacion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.fecha_liquidacion && errors.fecha_liquidacion}
                        max={moment().format('YYYY-MM-DD')}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fecha_liquidacion}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Motivo</Form.Label>
                      <Form.Select
                        name="motivo"
                        value={values.motivo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.motivo && errors.motivo}
                      >
                        <option value="">Seleccione...</option>
                        <option value="DESPIDO_JUSTIFICADO">Despido Justificado</option>
                        <option value="DESPIDO_INJUSTIFICADO">Despido Injustificado</option>
                        <option value="RENUNCIA">Renuncia</option>
                        <option value="MUTUO_ACUERDO">Mutuo Acuerdo</option>
                        <option value="FALLECIMIENTO">Fallecimiento</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.motivo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Alert variant="info">
                  <strong>Nota:</strong> Al calcular la liquidación, el sistema tomará en cuenta la fecha de contratación del empleado, 
                  su salario actual, indemnización (si aplica), aguinaldo y bono 14 proporcionales, así como las vacaciones pendientes.
                </Alert>
                
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/liquidaciones')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Calculando...' : 'Calcular Liquidación'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NuevaLiquidacion;