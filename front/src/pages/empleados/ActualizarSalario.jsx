import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmpleadoById, updateSalario, getHistorialSalarios } from '../../services/empleadoService';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const validationSchema = Yup.object().shape({
  salario_nuevo: Yup.number()
    .required('El nuevo salario es obligatorio')
    .min(0, 'El salario debe ser un número positivo'),
  motivo: Yup.string()
    .required('El motivo es obligatorio')
});

const ActualizarSalario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empleadoRes, historialRes] = await Promise.all([
          getEmpleadoById(id),
          getHistorialSalarios(id)
        ]);
        
        if (empleadoRes.success) {
          setEmpleado(empleadoRes.data);
        } else {
          setError(empleadoRes.message || 'Error al cargar los datos del empleado');
        }
        
        if (historialRes.success) {
          setHistorial(historialRes.data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      // Agregar el ID del usuario que hace la modificación
      const salarioData = {
        ...values,
        id_usuario_modificacion: user.id
      };
      
      const resultado = await updateSalario(id, salarioData);
      
      if (resultado.success) {
        // Recargar datos
        const [empleadoRes, historialRes] = await Promise.all([
          getEmpleadoById(id),
          getHistorialSalarios(id)
        ]);
        
        if (empleadoRes.success) {
          setEmpleado(empleadoRes.data);
        }
        
        if (historialRes.success) {
          setHistorial(historialRes.data);
        }
        
        // Resetear formulario
        resetForm();
        
        // Mostrar mensaje de éxito
        alert('Salario actualizado exitosamente');
      } else {
        setStatus({ error: resultado.message || 'Error al actualizar el salario' });
      }
    } catch (error) {
      console.error('Error al actualizar salario:', error);
      setStatus({ error: error.message || 'Error al actualizar el salario' });
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

  return (
    <Container>
      <h1 className="mb-4">Actualizar Salario</h1>
      
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
            
            <dt className="col-sm-3">Salario Actual</dt>
            <dd className="col-sm-9"><strong>Q {Number(empleado.salario_actual).toFixed(2)}</strong></dd>
          </dl>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header as="h5">Actualizar Salario</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              salario_nuevo: '',
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
                  <Form.Label>Nuevo Salario</Form.Label>
                  <Form.Control
                    type="number"
                    name="salario_nuevo"
                    value={values.salario_nuevo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.salario_nuevo && errors.salario_nuevo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salario_nuevo}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="motivo"
                    value={values.motivo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.motivo && errors.motivo}
                  />
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
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Actualizar Salario'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header as="h5">Historial de Salarios</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha de Cambio</th>
                <th>Salario Anterior</th>
                <th>Salario Nuevo</th>
                <th>Motivo</th>
                <th>Modificado Por</th>
              </tr>
            </thead>
            <tbody>
              {historial.length > 0 ? (
                historial.map((registro) => (
                  <tr key={registro.id_historico_salario}>
                    <td>{moment(registro.fecha_cambio).format('DD/MM/YYYY')}</td>
                    <td>Q {Number(registro.salario_anterior).toFixed(2)}</td>
                    <td>Q {Number(registro.salario_nuevo).toFixed(2)}</td>
                    <td>{registro.motivo}</td>
                    <td>{registro.usuario_modificacion || 'Sistema'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay registros de cambios de salario
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

export default ActualizarSalario;