import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { crearPeriodo } from '../../services/nominaService';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const validationSchema = Yup.object().shape({
  tipo: Yup.string().required('El tipo de período es obligatorio'),
  fecha_inicio: Yup.date().required('La fecha de inicio es obligatoria'),
  fecha_fin: Yup.date()
    .required('La fecha de fin es obligatoria')
    .min(Yup.ref('fecha_inicio'), 'La fecha de fin debe ser posterior a la fecha de inicio')
});

const generarSemanasDelMes = (mes, anio) => {
  const semanas = [];
  const fecha = moment(`${anio}-${mes}-01`, 'YYYY-MM-DD');
  const finMes = fecha.clone().endOf('month');
  const hoy = moment();

  for (let i = 0; i < 5; i++) {
    const inicio = fecha.clone().add(i * 7, 'days');
    if (inicio.isAfter(finMes)) break;
    const fin = moment.min(inicio.clone().add(6, 'days'), finMes);

    if (
      anio === hoy.year() &&
      parseInt(mes) === hoy.month() + 1 &&
      inicio.isAfter(hoy)
    ) {
      continue;
    }

    semanas.push({
      label: `${inicio.format('D')} al ${fin.format('D')}`,
      fecha_inicio: inicio.format('YYYY-MM-DD'),
      fecha_fin: fin.format('YYYY-MM-DD')
    });
  }

  return semanas;
};

const NuevoPeriodo = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [anioSeleccionado, setAnioSeleccionado] = useState(moment().year());
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [semanas, setSemanas] = useState([]);

  const aniosDisponibles = [];
  const anioActual = moment().year();
  for (let i = anioActual; i >= 2000; i--) {
    aniosDisponibles.push(i);
  }

  const obtenerMesesDisponibles = (anio) => {
    const mesLimite = anio === moment().year() ? moment().month() : 11;
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses.map((mes, idx) => ({
      label: mes,
      value: String(idx + 1).padStart(2, '0')
    })).filter((_, idx) => idx <= mesLimite);
  };

  const mesesDisponibles = obtenerMesesDisponibles(anioSeleccionado);

  const generarPeriodoMensual = (anio, mes) => {
    const inicio = moment(`${anio}-${mes}-01`);
    const fin = inicio.clone().endOf('month');
    return {
      fecha_inicio: inicio.format('YYYY-MM-DD'),
      fecha_fin: fin.format('YYYY-MM-DD')
    };
  };

  const generarPeriodoQuincenal = (anio, mes, quincena) => {
    const inicio = moment(`${anio}-${mes}-${quincena === 'primera' ? '01' : '16'}`);
    const fin = quincena === 'primera'
      ? moment(`${anio}-${mes}-15`)
      : inicio.clone().endOf('month');
    return {
      fecha_inicio: inicio.format('YYYY-MM-DD'),
      fecha_fin: fin.format('YYYY-MM-DD')
    };
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

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Formik
            initialValues={{
              tipo: 'QUINCENAL',
              fecha_inicio: '', 
              fecha_fin: ''     
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
            }) => {
              const isButtonDisabled = !values.fecha_inicio || !values.fecha_fin || isSubmitting;

              return (
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
                        const tipo = e.target.value;
                        setFieldValue('fecha_inicio', '');
                        setFieldValue('fecha_fin', '');
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

                  {(values.tipo === 'MENSUAL' || values.tipo === 'QUINCENAL') && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Año</Form.Label>
                          <Form.Select
                            value={anioSeleccionado}
                            onChange={(e) => {
                              const nuevoAnio = parseInt(e.target.value, 10);
                              setAnioSeleccionado(nuevoAnio);
                              setMesSeleccionado('');
                              setFieldValue('fecha_inicio', '');
                              setFieldValue('fecha_fin', '');
                            }}
                          >
                            <option value="">Selecciona un año</option>
                            {aniosDisponibles.map((anio) => (
                              <option key={anio} value={anio}>{anio}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mes</Form.Label>
                          <Form.Select
                            value={mesSeleccionado}
                            onChange={(e) => {
                              const mes = e.target.value;
                              setMesSeleccionado(mes);

                              if (values.tipo === 'MENSUAL') {
                                const { fecha_inicio, fecha_fin } = generarPeriodoMensual(anioSeleccionado, mes);
                                setFieldValue('fecha_inicio', fecha_inicio);
                                setFieldValue('fecha_fin', fecha_fin);
                              } else if (values.tipo === 'QUINCENAL') {
                                setFieldValue('fecha_inicio', '');
                                setFieldValue('fecha_fin', '');
                              }
                            }}
                          >
                            <option value="">Selecciona un mes</option>
                            {mesesDisponibles.map((m) => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {values.tipo === 'QUINCENAL' && mesSeleccionado && (
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quincena</Form.Label>
                            <div className="d-flex gap-2">
                              <Button
                                variant={
                                  values.fecha_inicio && moment(values.fecha_inicio).date() === 1
                                    ? 'primary' : 'outline-secondary'
                                }
                                onClick={() => {
                                  const { fecha_inicio, fecha_fin } =
                                    generarPeriodoQuincenal(anioSeleccionado, mesSeleccionado, 'primera');
                                  setFieldValue('fecha_inicio', fecha_inicio);
                                  setFieldValue('fecha_fin', fecha_fin);
                                }}
                              >
                                Primera (1 - 15)
                              </Button>

                              <Button
                                variant={
                                  values.fecha_inicio && moment(values.fecha_inicio).date() === 16
                                    ? 'primary' : 'outline-secondary'
                                }
                                onClick={() => {
                                  const { fecha_inicio, fecha_fin } =
                                    generarPeriodoQuincenal(anioSeleccionado, mesSeleccionado, 'segunda');
                                  setFieldValue('fecha_inicio', fecha_inicio);
                                  setFieldValue('fecha_fin', fecha_fin);
                                }}
                              >
                                Segunda (16 - fin de mes)
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  )}

                  {values.tipo === 'SEMANAL' && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Año</Form.Label>
                            <Form.Select
                              value={anioSeleccionado}
                              onChange={(e) => {
                                const nuevoAnio = parseInt(e.target.value, 10);
                                setAnioSeleccionado(nuevoAnio);
                                setMesSeleccionado('');
                                setFieldValue('fecha_inicio', '');
                                setFieldValue('fecha_fin', '');
                                setSemanas([]);
                              }}
                            >
                              <option value="">Selecciona un año</option>
                              {aniosDisponibles.map((anio) => (
                                <option key={anio} value={anio}>{anio}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mes</Form.Label>
                            <Form.Select
                              value={mesSeleccionado}
                              onChange={(e) => {
                                const mes = e.target.value;
                                setMesSeleccionado(mes);
                                const semanasGeneradas = generarSemanasDelMes(mes, anioSeleccionado);
                                setSemanas(semanasGeneradas);
                                setFieldValue('fecha_inicio', '');
                                setFieldValue('fecha_fin', '');
                              }}
                              disabled={!anioSeleccionado}
                            >
                              <option value="">Selecciona un mes</option>
                              {mesesDisponibles.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {mesSeleccionado && (
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Semana</Form.Label>
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                {semanas.map((s, idx) => {
                                  const isSelected =
                                    values.fecha_inicio === s.fecha_inicio &&
                                    values.fecha_fin === s.fecha_fin;
                                  return (
                                    <Button
                                      key={idx}
                                      variant={isSelected ? 'primary' : 'outline-secondary'}
                                      onClick={() => {
                                        setFieldValue('fecha_inicio', s.fecha_inicio);
                                        setFieldValue('fecha_fin', s.fecha_fin);
                                      }}
                                      className="text-start"
                                    >
                                      <div>
                                        <strong>Semana {idx + 1}</strong>
                                        <br />
                                        <small>
                                          {moment(s.fecha_inicio).format('DD-MM-YY')} al {moment(s.fecha_fin).format('DD-MM-YY')}
                                        </small>
                                      </div>
                                    </Button>
                                  );
                                })}
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                    </>
                  )}

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
                      disabled={isButtonDisabled}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NuevoPeriodo;