import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { crearPeriodo } from '../../services/nominaService';

const validationSchema = Yup.object().shape({
  tipo: Yup.string()
    .required('El tipo de período es obligatorio'),
  fecha_inicio: Yup.date()
    .required('La fecha de inicio es obligatoria'),
  fecha_fin: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(
      Yup.ref('fecha_inicio'),
      'La fecha de fin debe ser posterior a la fecha de inicio'
    )
});

const NuevoPeriodo = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const generarFechas = (tipo, fechaInicio) => {
    let fechaFin;
    
    if (!fechaInicio) return null;
    
    const inicio = moment(fechaInicio);
    
    switch (tipo) {
      case 'SEMANAL':
        fechaFin = inicio.clone().add(6, 'days');
        break;
      case 'QUINCENAL':
        fechaFin = inicio.clone().add(14, 'days');
        break;
      case 'MENSUAL':
        fechaFin = inicio.clone().add(1, 'month').subtract(1, 'day');
        break;
      default:
        return null;
    }
    
    return fechaFin.format('YYYY-MM-DD');
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const resultado = await crearPeriodo(values);
      
      if (resultado.success) {
        navigate('/nomina/periodos');
      } else {
        setStatus({ error: resultado.message || 'Error al crear el período' });
      }
    } catch (error) {
      console.error('Error al crear período:', error);
      setStatus({ error: error.message || 'Error al crear el período' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Nuevo Período de Nómina</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card>
        <Card.Body>
          <Formik
            initialValues={{
              tipo: 'QUINCENAL',
              fecha_inicio: moment().format('YYYY-MM-DD'),
              fecha_fin: moment().add(14, 'days').format('YYYY-MM-DD')
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
            }) => (
              <Form onSubmit={handleSubmit}>
                {status && status.error && (
                  <Alert variant="danger">{status.error}</Alert>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Período</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={values.tipo}
                    onChange={(e) => {
                      handleChange(e);
                      const nuevaFechaFin = generarFechas(e.target.value, values.fecha_inicio);
                      if (nuevaFechaFin) {
                        setFieldValue('fecha_fin', nuevaFechaFin);
                      }
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.tipo && errors.tipo}
                  >
                    <option value="SEMANAL">Semanal</option>
                    <option value="QUINCENAL">Quincenal</option>
                    <option value="MENSUAL">Mensual</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.tipo}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha_inicio"
                        value={values.fecha_inicio}
                        onChange={(e) => {
                          handleChange(e);
                          const nuevaFechaFin = generarFechas(values.tipo, e.target.value);
                          if (nuevaFechaFin) {
                            setFieldValue('fecha_fin', nuevaFechaFin);
                          }
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.fecha_inicio && errors.fecha_inicio}
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
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fecha_fin}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/nomina/periodos')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
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

export default NuevoPeriodo;