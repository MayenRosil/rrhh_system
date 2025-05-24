import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
});

const Login = () => {
  const { login, loading } = useAuth();
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (values) => {
    setLoginError(null);
    const result = await login(values.email, values.password);
    if (!result.success) {
      setLoginError(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-background">
      <Container className="login-container">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg rounded-4 border-0 p-3 animate__animated animate__fadeInDown">
              <Card.Header className="text-center bg-gradient-primary text-white rounded-top-4">
                <h3 className="fw-bold">Sistema de Recursos Humanos</h3>
              </Card.Header>
              <Card.Body>
                <h4 className="text-center mb-4">Iniciar Sesión</h4>
                
                {loginError && (
                  <Alert variant="danger" className="text-center">{loginError}</Alert>
                )}
                
                <Formik
                  initialValues={{ email: '', password: '' }}
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
                    isSubmitting
                  }) => (
                    <Form onSubmit={handleSubmit}>
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
                      
                      <Form.Group className="mb-4">
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
                      
                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={isSubmitting || loading}
                          className="btn-lg"
                        >
                          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
