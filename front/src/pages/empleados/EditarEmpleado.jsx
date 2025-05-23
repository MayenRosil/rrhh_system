import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmpleadoById, updateEmpleado } from '../../services/empleadoService';
import api from '../../services/api';

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es obligatorio'),
  apellido: Yup.string()
    .required('El apellido es obligatorio'),
  direccion: Yup.string()
    .required('La dirección es obligatoria'),
  telefono: Yup.string()
    .required('El teléfono es obligatorio'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  id_puesto: Yup.number()
    .required('El puesto es obligatorio'),
  id_rol: Yup.number()
    .required('El rol es obligatorio'),
  salario_actual: Yup.string()
    .required('El salario es obligatorio')
});

const EditarEmpleado = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);

  const fetchPuestosByDepartamento = async (iddepto) => {
    if (iddepto) {
      try {
        const response = await api.get(`/puestos/departamento/${iddepto}`);
        if (response.data.success) {
          setPuestos(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar puestos:', error);
      }
    } else {
      setPuestos([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadoRes = await getEmpleadoById(id);

        if (empleadoRes.success) {
          const empleadoData = empleadoRes.data;
          setEmpleado(empleadoData);
          setSelectedDepartamento(empleadoData.id_departamento);

          await fetchPuestosByDepartamento(empleadoData.id_departamento);
        } else {
          setError(empleadoRes.message || 'Error al cargar los datos del empleado');
          return;
        }

        const [deptosResponse, rolesResponse] = await Promise.all([
          api.get('/departamentos'),
          api.get('/auth/roles')
        ]);

        if (deptosResponse.data.success) {
          setDepartamentos(deptosResponse.data.data);
        }

        if (rolesResponse.data.success) {
          setRoles(rolesResponse.data.data);
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


  const handleDepartamentoChange = (e, setFieldValue) => {
    const departamentoId = e.target.value;
    setSelectedDepartamento(departamentoId);
    setFieldValue('id_departamento', departamentoId);
    setFieldValue('id_puesto', '');
    setFieldValue('salario_actual', '');
  };

  const handlePuestoChange = (e, setFieldValue) => {
    const puestoId = e.target.value;
    setFieldValue('id_puesto', puestoId);

    if (puestoId) {
      const puestoSeleccionado = puestos.find(p => p.id_puesto === parseInt(puestoId));
      if (puestoSeleccionado) {
        const salarioFormateado = `Q${Number(puestoSeleccionado.salario_base).toFixed(2)}`;
        setFieldValue('salario_actual', salarioFormateado);
      }
    } else {
      setFieldValue('salario_actual', '');
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Remover tipo_pago del objeto a enviar y convertir salario a número
      const { tipo_pago, ...empleadoData } = values;

      // Convertir salario formateado de vuelta a número
      if (empleadoData.salario_actual && typeof empleadoData.salario_actual === 'string') {
        empleadoData.salario_actual = parseFloat(empleadoData.salario_actual.replace('Q', ''));
      }

      const resultado = await updateEmpleado(id, empleadoData);

      if (resultado.success) {
        navigate('/empleados');
      } else {
        setStatus({ error: resultado.message || 'Error al actualizar el empleado' });
      }
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      setStatus({ error: error.message || 'Error al actualizar el empleado' });
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
      <h1 className="mb-4">Editar Empleado</h1>

      <Card>
        <Card.Body>
          <Formik
            initialValues={{
              nombre: empleado.nombre || '',
              apellido: empleado.apellido || '',
              direccion: empleado.direccion || '',
              telefono: empleado.telefono || '',
              email: empleado.email || '',
              id_departamento: empleado.id_departamento || '',
              id_puesto: empleado.id_puesto || '',
              id_rol: empleado.id_rol || '',
              salario_actual: empleado.salario_actual ? `Q${Number(empleado.salario_actual).toFixed(2)}` : ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código de Empleado</Form.Label>
                      <Form.Control
                        type="text"
                        value={empleado.codigo_empleado}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        El código de empleado no se puede modificar
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>DPI</Form.Label>
                      <Form.Control
                        type="text"
                        value={empleado.dpi}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        El DPI no se puede modificar
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={values.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.nombre && errors.nombre}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={values.apellido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.apellido && errors.apellido}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.direccion && errors.direccion}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.direccion}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        value={values.telefono}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.telefono && errors.telefono}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Departamento</Form.Label>
                      <Form.Select
                        name="id_departamento"
                        value={values.id_departamento}
                        onChange={(e) => handleDepartamentoChange(e, setFieldValue)}
                        onBlur={handleBlur}
                        isInvalid={touched.id_departamento && errors.id_departamento}
                      >
                        <option value="">Seleccione...</option>
                        {departamentos.map((dpto) => (
                          <option key={dpto.id_departamento} value={dpto.id_departamento}>
                            {dpto.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_departamento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Puesto</Form.Label>
                      <Form.Select
                        name="id_puesto"
                        value={values.id_puesto}
                        onChange={(e) => handlePuestoChange(e, setFieldValue)}
                        onBlur={handleBlur}
                        isInvalid={touched.id_puesto && errors.id_puesto}
                        disabled={!selectedDepartamento}
                      >
                        <option value="">Seleccione...</option>
                        {puestos.map((puesto) => (
                          <option key={puesto.id_puesto} value={puesto.id_puesto}>
                            {puesto.nombre} - Q{Number(puesto.salario_base).toFixed(2)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_puesto}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        name="id_rol"
                        value={values.id_rol}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.id_rol && errors.id_rol}
                      >
                        <option value="">Seleccione...</option>
                        {roles.map((rol) => (
                          <option key={rol.id_rol} value={rol.id_rol}>
                            {rol.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_rol}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salario</Form.Label>
                      <Form.Control
                        type="text"
                        name="salario_actual"
                        value={values.salario_actual}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.salario_actual && errors.salario_actual}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salario_actual}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        El salario se establece automáticamente según el puesto seleccionado.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

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
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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

export default EditarEmpleado;