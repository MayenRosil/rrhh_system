import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmpleadoById, darDeBaja } from '../../services/empleadoService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const validationSchema = Yup.object().shape({
  fecha_fin: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(new Date(), 'La fecha de fin debe ser futura'),
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

const DarDeBaja = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const resultado = await getEmpleadoById(id);
        
        if (resultado.success) {
          setEmpleado(resultado.data);
        } else {
          setError(resultado.message || 'Error al cargar los datos del empleado');
        }
      } catch (error) {
        console.error('Error al cargar empleado:', error);
        setError('Error al cargar los datos del empleado');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const resultado = await darDeBaja(id, values);
      
      if (resultado.success) {
        navigate('/empleados');
      } else {
        setStatus({ error: resultado.message || 'Error al dar de baja al empleado' });
      }
    } catch (error) {
      console.error('Error al dar de baja al empleado:', error);
      setStatus({ error: error.message || 'Error al dar de baja al empleado' });
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

  if (!empleado) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo cargar la información del empleado'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/empleados')}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  if (empleado.estado !== 'ACTIVO') {
    return (
      <Container>
        <Alert variant="warning">
          Este empleado ya no está activo. No puede darse de baja.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/empleados')}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Dar de Baja a Empleado</h1>
      
      <Card className="mb-4">
        <Card.Header as="h5">Información del Empleado</Card.Header>
        <Card.Body>
          <dl className="row">
            <dt className="col-sm-3">Código</dt>
            <dd className="col-sm-9">{empleado.codigo_empleado}</dd>
            
            <dt className="col-sm-3">Nombre</dt>
            <dd className="col-sm-9">{empleado.nombre} {empleado.apellido}</dd>
            
            <dt className="col-sm-3">Puesto</dt>
            <dd className="col-sm-9">{empleado.puesto}</dd>
            
            <dt className="col-sm-3">Departamento</dt>
            <dd className="col-sm-9">{empleado.departamento}</dd>
            
            <dt className="col-sm-3">Fecha de Contratación</dt>
            <dd className="col-sm-9">{moment(empleado.fecha_contratacion).format('LL')}</dd>
          </dl>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="text-white bg-danger">
          <h5 className="m-0">Información de Baja</h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            <strong>¡Advertencia!</strong> Esta acción dará de baja al empleado y no podrá ser revertida.
          </Alert>
          
          <Formik
            initialValues={{
              fecha_fin: moment().add(1, 'days').format('YYYY-MM-DD'),
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
                  <Form.Label>Fecha de Fin de Contrato</Form.Label>
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
                
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/empleados')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Procesando...' : 'Dar de Baja'}
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

export default DarDeBaja;