import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, ListGroup, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { getProfile } from '../services/authService';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const Perfil = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          setPerfil(response.user);
        } else {
          setError(response.message || 'Error al cargar el perfil');
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!perfil) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'No se pudo cargar la información del perfil'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Mi Perfil</h1>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaUser style={{ fontSize: '5rem', color: '#007bff' }} />
              </div>
              <Card.Title>{perfil.nombre} {perfil.apellido}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{perfil.puesto}</Card.Subtitle>
              <Card.Text>{perfil.departamento}</Card.Text>
              <Button 
                variant="outline-primary" 
                size="sm" 
                href="/cambiar-password"
              >
                Cambiar Contraseña
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header as="h5">Información Personal</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaIdCard /></Col>
                    <Col xs={4}><strong>Código:</strong></Col>
                    <Col>{perfil.codigo_empleado}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaIdCard /></Col>
                    <Col xs={4}><strong>DPI:</strong></Col>
                    <Col>{perfil.dpi}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaEnvelope /></Col>
                    <Col xs={4}><strong>Email:</strong></Col>
                    <Col>{perfil.email}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaPhone /></Col>
                    <Col xs={4}><strong>Teléfono:</strong></Col>
                    <Col>{perfil.telefono}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaCalendarAlt /></Col>
                    <Col xs={4}><strong>Fecha de Nacimiento:</strong></Col>
                    <Col>{moment(perfil.fecha_nacimiento).format('LL')}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={1}><FaMapMarkerAlt /></Col>
                    <Col xs={4}><strong>Dirección:</strong></Col>
                    <Col>{perfil.direccion}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header as="h5">Información Laboral</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Puesto:</strong></Col>
                    <Col>{perfil.puesto}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Departamento:</strong></Col>
                    <Col>{perfil.departamento}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Rol:</strong></Col>
                    <Col>{perfil.rol}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Fecha de Contratación:</strong></Col>
                    <Col>{moment(perfil.fecha_contratacion).format('LL')}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Salario Actual:</strong></Col>
                    <Col>Q {Number(perfil.salario_actual).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}><strong>Tipo de Pago:</strong></Col>
                    <Col>
                      {perfil.tipo_pago === 'SEMANAL' && 'Semanal'}
                      {perfil.tipo_pago === 'QUINCENAL' && 'Quincenal'}
                      {perfil.tipo_pago === 'MENSUAL' && 'Mensual'}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;