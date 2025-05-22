import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaUserMinus, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import { getAllEmpleados } from '../../services/empleadoService';

const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const resultado = await getAllEmpleados();
        if (resultado.success) {
          setEmpleados(resultado.data);
          setFilteredEmpleados(resultado.data);
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = empleados.filter(empleado => 
        empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.codigo_empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.dpi.includes(searchTerm)
      );
      setFilteredEmpleados(filtered);
    } else {
      setFilteredEmpleados(empleados);
    }
  }, [searchTerm, empleados]);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return <Badge bg="success">Activo</Badge>;
      case 'INACTIVO':
        return <Badge bg="secondary">Inactivo</Badge>;
      case 'SUSPENDIDO':
        return <Badge bg="warning">Suspendido</Badge>;
      case 'DESPEDIDO':
        return <Badge bg="danger">Despedido</Badge>;
      case 'RENUNCIA':
        return <Badge bg="info">Renuncia</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Empleados</h1>
        <Button as={Link} to="/empleados/nuevo" variant="primary">Nuevo Empleado</Button>
      </div>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar por nombre, apellido, código o DPI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Departamento</th>
            <th>Salario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmpleados.length > 0 ? (
            filteredEmpleados.map((empleado) => (
              <tr key={empleado.id_empleado}>
                <td>{empleado.codigo_empleado}</td>
                <td>{empleado.nombre} {empleado.apellido}</td>
                <td>{empleado.puesto}</td>
                <td>{empleado.departamento}</td>
                <td>Q {Number(empleado.salario_actual).toFixed(2)}</td>
                <td>{getEstadoBadge(empleado.estado)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/empleados/${empleado.id_empleado}`}
                      title="Editar"
                    >
                      <FaEdit />
                    </Button>
                    
                    {empleado.estado === 'ACTIVO' && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          as={Link}
                          to={`/empleados/${empleado.id_empleado}/salario`}
                          title="Actualizar Salario"
                        >
                          <FaMoneyBillWave />
                        </Button>
                        
                        <Button
                          variant="outline-danger"
                          size="sm"
                          as={Link}
                          to={`/empleados/${empleado.id_empleado}/baja`}
                          title="Dar de Baja"
                        >
                          <FaUserMinus />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No se encontraron empleados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaEmpleados;