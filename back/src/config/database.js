const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para ejecutar consultas
async function query(sql, params) {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    throw error;
  }
}

// Función para ejecutar procedimientos almacenados
async function callProcedure(procedure, params = []) {
  try {
    // Crear el llamado al procedimiento almacenado
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${procedure}(${placeholders})`;
    
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
    throw error;
  }
}

// Función para ejecutar procedimientos almacenados con parámetros de salida
async function callProcedureWithOutput(procedure, inParams = [], outParamsCount = 0) {
  try {
    // Crear variables para los parámetros de salida
    let outVars = '';
    if (outParamsCount > 0) {
      outVars = ', ' + Array(outParamsCount).fill('@output_param').map((v, i) => `${v}${i+1}`).join(', ');
    }
    
    // Crear el llamado al procedimiento almacenado
    const inPlaceholders = inParams.map(() => '?').join(',');
    const sql = `CALL ${procedure}(${inPlaceholders}${outVars})`;
    
    // Ejecutar el procedimiento
    await pool.execute(sql, inParams);
    
    // Obtener los valores de salida si hay parámetros de salida
    if (outParamsCount > 0) {
      const outParamSQL = `SELECT ${Array(outParamsCount).fill('@output_param').map((v, i) => `${v}${i+1} as param${i+1}`).join(', ')}`;
      const [outResults] = await pool.execute(outParamSQL);
      return outResults[0];
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado con parámetros de salida:', error);
    throw error;
  }
}

// Función para iniciar una transacción
async function startTransaction() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  return conn;
}

// Función para confirmar una transacción
async function commitTransaction(conn) {
  await conn.commit();
  conn.release();
}

// Función para revertir una transacción
async function rollbackTransaction(conn) {
  await conn.rollback();
  conn.release();
}

module.exports = {
  query,
  callProcedure,
  callProcedureWithOutput,
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  pool
};