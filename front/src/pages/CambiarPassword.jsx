import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { changePassword } from '../services/authService';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('La contraseña actual es obligatoria'),
  newPassword: Yup.string()
    .required('La nueva contraseña es obligatoria')
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirmar la contraseña es obligatorio')
    .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
});

const CambiarPassword = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      const result = await changePassword(values.oldPassword, values.newPassword);
      
      if (result.success) {
        setSuccess(true);
        resetForm();
      } else {
        setStatus({ error: result.message || 'Error al cambiar la contraseña' });
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setStatus({ error: error.message || 'Error al cambiar la contraseña' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Cambiar Contraseña</h1>
      
      <Card>
        <Card.Body>
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              Contraseña actualizada exitosamente
            </Alert>
          )}
          
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
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
              status
            }) => (
              <Form onSubmit={handleSubmit}>
                {status && status.error && (
                  <Alert variant="danger">{status.error}</Alert>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.oldPassword && errors.oldPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.oldPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.newPassword && errors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
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
                
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
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

export default CambiarPassword;