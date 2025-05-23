import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createEmpleado } from '../../services/empleadoService';
import api from '../../services/api';

const validationSchema = Yup.object().shape({
  codigo_empleado: Yup.string()
    .required('El código de empleado es obligatorio'),
  nombre: Yup.string()
    .required('El nombre es obligatorio'),
  apellido: Yup.string()
    .required('El apellido es obligatorio'),
  dpi: Yup.string()
    .required('El DPI es obligatorio')
    .matches(/^[0-9]{13}$/, 'El DPI debe tener 13 dígitos'),
  fecha_nacimiento: Yup.date()
    .required('La fecha de nacimiento es obligatoria')
    .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
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
  fecha_contratacion: Yup.date()
    .required('La fecha de contratación es obligatoria'),
  salario_actual: Yup.number()
    .required('El salario es obligatorio')
    .min(0, 'El salario debe ser un número positivo'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirmar la contraseña es obligatorio')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
});

const NuevoEmpleado = () => {
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
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
        console.error('Error al cargar catálogos:', error);
        setError('Error al cargar los catálogos necesarios');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogos();
  }, []);

  useEffect(() => {
    const fetchPuestosByDepartamento = async () => {
      if (selectedDepartamento) {
        try {
          const response = await api.get(`/puestos/departamento/${selectedDepartamento}`);
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

    fetchPuestosByDepartamento();
  }, [selectedDepartamento]);

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
        setFieldValue('salario_actual', parseFloat(puestoSeleccionado.salario_base));
      }
    } else {
      setFieldValue('salario_actual', '');
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const { confirmPassword, tipo_pago, ...empleadoData } = values;
      const resultado = await createEmpleado(empleadoData);
      
      if (resultado.success) {
        navigate('/empleados');
      } else {
        setStatus({ error: resultado.message || 'Error al crear el empleado' });
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);
      setStatus({ error: error.message || 'Error al crear el empleado' });
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
      <h1 className="mb-4">Nuevo Empleado</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Card>
        <Card.Body>
          <Formik
            initialValues={{
              codigo_empleado: '',
              nombre: '',
              apellido: '',
              dpi: '',
              fecha_nacimiento: '',
              direccion: '',
              telefono: '',
              email: '',
              id_departamento: '',
              id_puesto: '',
              id_rol: '',
              fecha_contratacion: new Date().toISOString().split('T')[0],
              salario_actual: '',
              password: '',
              confirmPassword: ''
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
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código de Empleado</Form.Label>
                      <Form.Control
                        type="text"
                        name="codigo_empleado"
                        value={values.codigo_empleado}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.codigo_empleado && errors.codigo_empleado}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.codigo_empleado}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>DPI</Form.Label>
                      <Form.Control
                        type="text"
                        name="dpi"
                        value={values.dpi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dpi && errors.dpi}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dpi}
                      </Form.Control.Feedback>
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
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha_nacimiento"
                        value={values.fecha_nacimiento}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.fecha_nacimiento && errors.fecha_nacimiento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fecha_nacimiento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Contratación</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha_contratacion"
                        value={values.fecha_contratacion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.fecha_contratacion && errors.fecha_contratacion}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fecha_contratacion}
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
                        type="number"
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
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
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

export default NuevoEmpleado;