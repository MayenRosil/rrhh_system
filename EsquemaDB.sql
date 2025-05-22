-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS rrhh_system;
USE rrhh_system;

-- Tabla de Departamentos
CREATE TABLE departamentos (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Puestos
CREATE TABLE puestos (
    id_puesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    salario_base DECIMAL(10,2) NOT NULL,
    id_departamento INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

-- Tabla de Roles
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Empleados
CREATE TABLE empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    codigo_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dpi VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    id_puesto INT NOT NULL,
    id_rol INT NOT NULL,
    fecha_contratacion DATE NOT NULL,
    fecha_fin_contrato DATE,
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'DESPEDIDO', 'RENUNCIA') DEFAULT 'ACTIVO',
    salario_actual DECIMAL(10,2) NOT NULL,
    tipo_pago ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL') DEFAULT 'QUINCENAL',
    password VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_puesto) REFERENCES puestos(id_puesto),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla de Parámetros del Sistema
CREATE TABLE parametros_sistema (
    id_parametro INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    valor DECIMAL(10,4) NOT NULL,
    descripcion VARCHAR(255),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Deducciones
CREATE TABLE tipos_deducciones (
    id_tipo_deduccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    formula VARCHAR(255),
    es_porcentaje BOOLEAN DEFAULT TRUE,
    valor_default DECIMAL(10,4),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Bonificaciones
CREATE TABLE tipos_bonificaciones (
    id_tipo_bonificacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    formula VARCHAR(255),
    es_porcentaje BOOLEAN DEFAULT TRUE,
    valor_default DECIMAL(10,4),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Marcajes
CREATE TABLE marcajes (
    id_marcaje INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada DATETIME NOT NULL,
    hora_salida DATETIME,
    horas_trabajadas DECIMAL(5,2),
    observaciones VARCHAR(255),
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de Periodos de Nómina
CREATE TABLE periodos_nomina (
    id_periodo INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('ABIERTO', 'CERRADO', 'PROCESADO') DEFAULT 'ABIERTO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Nóminas
CREATE TABLE nominas (
    id_nomina INT AUTO_INCREMENT PRIMARY KEY,
    id_periodo INT NOT NULL,
    id_empleado INT NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL,
    horas_trabajadas DECIMAL(5,2) DEFAULT 0,
    salario_devengado DECIMAL(10,2) NOT NULL,
    total_deducciones DECIMAL(10,2) DEFAULT 0,
    total_bonificaciones DECIMAL(10,2) DEFAULT 0,
    sueldo_liquido DECIMAL(10,2) NOT NULL,
    estado ENUM('PENDIENTE', 'PAGADO', 'ANULADO') DEFAULT 'PENDIENTE',
    fecha_pago DATE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_periodo) REFERENCES periodos_nomina(id_periodo),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de Detalle de Deducciones por Nómina
CREATE TABLE deducciones_nomina (
    id_deduccion_nomina INT AUTO_INCREMENT PRIMARY KEY,
    id_nomina INT NOT NULL,
    id_tipo_deduccion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nomina) REFERENCES nominas(id_nomina),
    FOREIGN KEY (id_tipo_deduccion) REFERENCES tipos_deducciones(id_tipo_deduccion)
);

-- Tabla de Detalle de Bonificaciones por Nómina
CREATE TABLE bonificaciones_nomina (
    id_bonificacion_nomina INT AUTO_INCREMENT PRIMARY KEY,
    id_nomina INT NOT NULL,
    id_tipo_bonificacion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nomina) REFERENCES nominas(id_nomina),
    FOREIGN KEY (id_tipo_bonificacion) REFERENCES tipos_bonificaciones(id_tipo_bonificacion)
);

-- Tabla de Vacaciones
CREATE TABLE vacaciones (
    id_vacacion INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_tomados INT NOT NULL,
    estado ENUM('SOLICITADO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'TERMINADO') DEFAULT 'SOLICITADO',
    observaciones VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de Periodos Vacacionales (para control de saldos)
CREATE TABLE periodos_vacacionales (
    id_periodo_vacacional INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_correspondientes INT NOT NULL DEFAULT 15,
    dias_tomados INT NOT NULL DEFAULT 0,
    dias_pendientes INT NOT NULL DEFAULT 15,
    estado ENUM('ACTIVO', 'CERRADO', 'LIQUIDADO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de Liquidaciones
CREATE TABLE liquidaciones (
    id_liquidacion INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha_liquidacion DATE NOT NULL,
    motivo ENUM('DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'RENUNCIA', 'MUTUO_ACUERDO', 'FALLECIMIENTO') NOT NULL,
    anos_laborados DECIMAL(5,2) NOT NULL,
    salario_promedio DECIMAL(10,2) NOT NULL,
    indemnizacion DECIMAL(10,2) DEFAULT 0,
    aguinaldo_proporcional DECIMAL(10,2) DEFAULT 0,
    bono14_proporcional DECIMAL(10,2) DEFAULT 0,
    vacaciones_pendientes DECIMAL(10,2) DEFAULT 0,
    otros_pagos DECIMAL(10,2) DEFAULT 0,
    total_deducciones DECIMAL(10,2) DEFAULT 0,
    total_liquidacion DECIMAL(10,2) NOT NULL,
    estado ENUM('CALCULADO', 'PAGADO', 'ANULADO') DEFAULT 'CALCULADO',
    observaciones VARCHAR(255),
    fecha_pago DATE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de Detalle de Deducciones por Liquidación
CREATE TABLE deducciones_liquidacion (
    id_deduccion_liquidacion INT AUTO_INCREMENT PRIMARY KEY,
    id_liquidacion INT NOT NULL,
    id_tipo_deduccion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_liquidacion) REFERENCES liquidaciones(id_liquidacion),
    FOREIGN KEY (id_tipo_deduccion) REFERENCES tipos_deducciones(id_tipo_deduccion)
);

-- Tabla de Histórico de Salarios
CREATE TABLE historico_salarios (
    id_historico_salario INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    salario_anterior DECIMAL(10,2) NOT NULL,
    salario_nuevo DECIMAL(10,2) NOT NULL,
    fecha_cambio DATE NOT NULL,
    motivo VARCHAR(255),
    id_usuario_modificacion INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    FOREIGN KEY (id_usuario_modificacion) REFERENCES empleados(id_empleado)
);

-- Tabla de Auditoría
CREATE TABLE auditoria (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    tabla VARCHAR(100) NOT NULL,
    id_registro INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    datos JSON NOT NULL,
    id_usuario INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES empleados(id_empleado)
);


