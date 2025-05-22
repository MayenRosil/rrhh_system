import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="mt-5">
            <h1 className="display-1 fw-bold">403</h1>
            <h2 className="mb-4">Acceso no autorizado</h2>
            <p className="lead mb-5">
              Lo sentimos, no tienes permisos para acceder a esta página.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="primary" 
                as={Link} 
                to="/"
              >
                <FaHome className="me-2" />
                Ir al inicio
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => window.history.back()}
              >
                <FaArrowLeft className="me-2" />
                Volver atrás
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;