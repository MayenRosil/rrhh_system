const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const db = require('../config/database');
const moment = require('moment');

// Reporte de nómina por período
router.get('/nomina/periodo/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener información del período
    const periodos = await db.query(`
      SELECT tipo, fecha_inicio, fecha_fin 
      FROM periodos_nomina 
      WHERE id_periodo = ?
    `, [id]);
    
    if (periodos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Período no encontrado'
      });
    }
    
    // Obtener nóminas del período con detalles
    const nominas = await db.query(`
      SELECT 
        n.id_nomina,
        e.codigo_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
        p.nombre AS puesto,
        d.nombre AS departamento,
        n.salario_base,
        n.salario_devengado,
        n.total_deducciones,
        n.total_bonificaciones,
        n.sueldo_liquido,
        n.estado
      FROM nominas n
      JOIN empleados e ON n.id_empleado = e.id_empleado
      JOIN puestos p ON e.id_puesto = p.id_puesto
      JOIN departamentos d ON p.id_departamento = d.id_departamento
      WHERE n.id_periodo = ?
      ORDER BY d.nombre, e.nombre, e.apellido
    `, [id]);
    
    // Obtener totales
    const totales = await db.query(`
      SELECT 
        COUNT(*) AS total_empleados,
        SUM(salario_base) AS total_salario_base,
        SUM(salario_devengado) AS total_salario_devengado,
        SUM(total_deducciones) AS total_deducciones,
        SUM(total_bonificaciones) AS total_bonificaciones,
        SUM(sueldo_liquido) AS total_sueldo_liquido
      FROM nominas
      WHERE id_periodo = ?
    `, [id]);
    
    res.status(200).json({
      success: true,
      data: {
        periodo: periodos[0],
        nominas: nominas,
        totales: totales[0]
      }
    });
  } catch (error) {
    console.error('Error al generar reporte de nómina por período:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
});

// Reporte de marcajes por departamento y rango de fechas
router.get('/marcajes/departamento/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas
    const fechaInicioValida = fechaInicio ? moment(fechaInicio, 'YYYY-MM-DD').isValid() : false;
    const fechaFinValida = fechaFin ? moment(fechaFin, 'YYYY-MM-DD').isValid() : false;
    
    // Si no se proporcionaron fechas, usar el mes actual
    const inicio = fechaInicioValida ? 
      moment(fechaInicio).format('YYYY-MM-DD') : 
      moment().startOf('month').format('YYYY-MM-DD');
    
    const fin = fechaFinValida ? 
      moment(fechaFin).format('YYYY-MM-DD') : 
      moment().endOf('month').format('YYYY-MM-DD');
    
    // Obtener departamento
    const departamentos = await db.query(
      'SELECT nombre FROM departamentos WHERE id_departamento = ?',
      [id]
    );
    
    if (departamentos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    // Obtener marcajes por departamento
    const marcajes = await db.query(`
      SELECT 
        m.id_marcaje,
        e.codigo_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
        p.nombre AS puesto,
        m.fecha,
        m.hora_entrada,
        m.hora_salida,
        m.horas_trabajadas,
        m.estado
      FROM marcajes m
      JOIN empleados e ON m.id_empleado = e.id_empleado
      JOIN puestos p ON e.id_puesto = p.id_puesto
      WHERE p.id_departamento = ?
      AND m.fecha BETWEEN ? AND ?
      ORDER BY m.fecha DESC, e.nombre, e.apellido
    `, [id, inicio, fin]);
    
    // Obtener resumen por empleado
    const resumenEmpleados = await db.query(`
      SELECT 
        e.id_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
        COUNT(m.id_marcaje) AS total_marcajes,
        SUM(CASE WHEN m.estado = 'APROBADO' THEN m.horas_trabajadas ELSE 0 END) AS total_horas_aprobadas
      FROM empleados e
      LEFT JOIN marcajes m ON e.id_empleado = m.id_empleado AND m.fecha BETWEEN ? AND ?
      JOIN puestos p ON e.id_puesto = p.id_puesto
      WHERE p.id_departamento = ?
      GROUP BY e.id_empleado
      ORDER BY e.nombre, e.apellido
    `, [inicio, fin, id]);
    
    res.status(200).json({
      success: true,
      data: {
        departamento: departamentos[0].nombre,
        fechaInicio: inicio,
        fechaFin: fin,
        marcajes: marcajes,
        resumenEmpleados: resumenEmpleados
      }
    });
  } catch (error) {
    console.error('Error al generar reporte de marcajes por departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
});

// Reporte de vacaciones por departamento
router.get('/vacaciones/departamento/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaInicio, fechaFin, estado } = req.query;
    
    // Validar fechas
    const fechaInicioValida = fechaInicio ? moment(fechaInicio, 'YYYY-MM-DD').isValid() : false;
    const fechaFinValida = fechaFin ? moment(fechaFin, 'YYYY-MM-DD').isValid() : false;
    
    // Si no se proporcionaron fechas, usar el año actual
    const inicio = fechaInicioValida ? 
      moment(fechaInicio).format('YYYY-MM-DD') : 
      moment().startOf('year').format('YYYY-MM-DD');
    
    const fin = fechaFinValida ? 
      moment(fechaFin).format('YYYY-MM-DD') : 
      moment().endOf('year').format('YYYY-MM-DD');
    
    // Construir la consulta
    let query = `
      SELECT 
        v.id_vacacion,
        e.codigo_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
        p.nombre AS puesto,
        v.fecha_inicio,
        v.fecha_fin,
        v.dias_tomados,
        v.estado,
        v.observaciones
      FROM vacaciones v
      JOIN empleados e ON v.id_empleado = e.id_empleado
      JOIN puestos p ON e.id_puesto = p.id_puesto
      WHERE p.id_departamento = ?
      AND (v.fecha_inicio BETWEEN ? AND ? OR v.fecha_fin BETWEEN ? AND ?)
    `;
    
    const params = [id, inicio, fin, inicio, fin];
    
    if (estado) {
      query += ' AND v.estado = ?';
      params.push(estado);
    }
    
    query += ' ORDER BY v.fecha_inicio DESC, e.nombre, e.apellido';
    
    // Obtener vacaciones
    const vacaciones = await db.query(query, params);
    
    // Obtener resumen por empleado
    const resumenEmpleados = await db.query(`
      SELECT 
        e.id_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
        pv.dias_correspondientes,
        pv.dias_tomados,
        pv.dias_pendientes
      FROM empleados e
      JOIN puestos p ON e.id_puesto = p.id_puesto
      LEFT JOIN periodos_vacacionales pv ON e.id_empleado = pv.id_empleado AND pv.estado = 'ACTIVO'
      WHERE p.id_departamento = ?
      ORDER BY e.nombre, e.apellido
    `, [id]);
    
    res.status(200).json({
      success: true,
      data: {
        fechaInicio: inicio,
        fechaFin: fin,
        estado: estado,
        vacaciones: vacaciones,
        resumenEmpleados: resumenEmpleados
      }
    });
  } catch (error) {
    console.error('Error al generar reporte de vacaciones por departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte',
      error: error.message
    });
  }
});

module.exports = router;