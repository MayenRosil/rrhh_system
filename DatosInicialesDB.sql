USE rrhh_system;

-- INSERTAR DATOS INICIALES
-- Insertar roles
INSERT INTO roles (nombre, descripcion) VALUES 
('Administrador', 'Acceso completo al sistema'),
('Empleado', 'Acceso limitado para empleados');

-- Insertar departamentos
INSERT INTO departamentos (nombre, descripcion) VALUES 
('Recursos Humanos', 'Gestión del personal'),
('Contabilidad', 'Gestión financiera'),
('Operaciones', 'Área operativa'),
('TI', 'Tecnología de la información'),
('Ventas', 'Departamento comercial');

-- Insertar puestos
INSERT INTO puestos (nombre, descripcion, salario_base, id_departamento) VALUES 
('Gerente de RRHH', 'Responsable del departamento de RRHH', 15000.00, 1),
('Analista de RRHH', 'Analista de recursos humanos', 8000.00, 1),
('Contador General', 'Responsable de contabilidad', 12000.00, 2),
('Auxiliar Contable', 'Asistente de contabilidad', 6000.00, 2),
('Gerente de Operaciones', 'Responsable de operaciones', 15000.00, 3),
('Operario', 'Personal operativo', 4000.00, 3),
('Gerente de TI', 'Responsable de sistemas', 18000.00, 4),
('Desarrollador', 'Programador de software', 10000.00, 4),
('Gerente de Ventas', 'Responsable de ventas', 15000.00, 5),
('Vendedor', 'Personal de ventas', 5000.00, 5);

-- Insertar parámetros del sistema
INSERT INTO parametros_sistema (nombre, valor, descripcion, fecha_inicio) VALUES 
('TASA_IGSS', 0.0483, 'Tasa de descuento del IGSS (4.83%)', '2017-01-01'),
('TASA_ISR', 0.05, 'Tasa simplificada de ISR (5%)', '2017-01-01'),
('BONIFICACION_INCENTIVO', 250.00, 'Bonificación incentivo mensual', '2017-01-01'),
('SALARIO_MINIMO', 2893.21, 'Salario mínimo mensual', '2017-01-01');

-- Insertar tipos de deducciones
INSERT INTO tipos_deducciones (nombre, descripcion, es_porcentaje, valor_default) VALUES 
('IGSS', 'Instituto Guatemalteco de Seguridad Social', TRUE, 0.0483),
('ISR', 'Impuesto Sobre la Renta', TRUE, 0.05);

-- Insertar tipos de bonificaciones
INSERT INTO tipos_bonificaciones (nombre, descripcion, es_porcentaje, valor_default) VALUES 
('BONIFICACION_INCENTIVO', 'Bonificación Incentivo (Decreto 78-89)', FALSE, 250.00);

-- Insertar un empleado administrador inicial (contraseña: admin123)
CALL sp_crear_empleado(
    'EMP001', 'Admin', 'Sistema', '1234567890101', '1990-01-01',
    'Ciudad de Guatemala', '55551234', 'admin@empresa.com',
    1, 1, '2017-01-01', 15000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);





-- Empleado 4 - Auxiliar Contable
CALL sp_crear_empleado(
    'EMP004', 'Ana', 'López', '1234567890104', '1992-11-08',
    'Zona 12, Ciudad de Guatemala', '55554567', 'ana.lopez@empresa.com',
    4, 2, '2019-03-10', 6000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 5 - Gerente de Operaciones
CALL sp_crear_empleado(
    'EMP005', 'Luis', 'Hernández', '1234567890105', '1980-04-12',
    'Zona 15, Ciudad de Guatemala', '55555678', 'luis.hernandez@empresa.com',
    5, 1, '2016-08-01', 15000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 6 - Operario
CALL sp_crear_empleado(
    'EMP006', 'José', 'Ramírez', '1234567890106', '1988-09-25',
    'Villa Nueva, Guatemala', '55556789', 'jose.ramirez@empresa.com',
    6, 2, '2020-01-15', 4000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 7 - Gerente de TI
CALL sp_crear_empleado(
    'EMP007', 'Roberto', 'Castillo', '1234567890107', '1983-12-03',
    'Zona 14, Ciudad de Guatemala', '55557890', 'roberto.castillo@empresa.com',
    7, 1, '2017-11-01', 18000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 8 - Desarrollador
CALL sp_crear_empleado(
    'EMP008', 'Diana', 'Pérez', '1234567890108', '1991-06-18',
    'Zona 11, Ciudad de Guatemala', '55558901', 'diana.perez@empresa.com',
    8, 2, '2019-07-20', 10000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 9 - Gerente de Ventas
CALL sp_crear_empleado(
    'EMP009', 'Fernando', 'García', '1234567890109', '1979-02-14',
    'Zona 9, Ciudad de Guatemala', '55559012', 'fernando.garcia@empresa.com',
    9, 1, '2016-04-10', 15000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 10 - Vendedor
CALL sp_crear_empleado(
    'EMP010', 'Patricia', 'Jiménez', '1234567890110', '1987-10-30',
    'Mixco, Guatemala', '55550123', 'patricia.jimenez@empresa.com',
    10, 2, '2020-09-05', 5000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 11 - Desarrollador Junior
CALL sp_crear_empleado(
    'EMP011', 'Miguel', 'Torres', '1234567890111', '1995-05-12',
    'Zona 7, Ciudad de Guatemala', '55551234', 'miguel.torres@empresa.com',
    8, 2, '2021-03-01', 7500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 12 - Operario de Producción
CALL sp_crear_empleado(
    'EMP012', 'Sandra', 'Vásquez', '1234567890112', '1986-08-07',
    'San Miguel Petapa, Guatemala', '55552345', 'sandra.vasquez@empresa.com',
    6, 2, '2018-11-20', 4200.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 13 - Auxiliar de Ventas
CALL sp_crear_empleado(
    'EMP013', 'Jorge', 'Mendoza', '1234567890113', '1993-01-28',
    'Zona 18, Ciudad de Guatemala', '55553456', 'jorge.mendoza@empresa.com',
    10, 2, '2021-08-15', 4800.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 14 - Analista Contable
CALL sp_crear_empleado(
    'EMP014', 'Carmen', 'Ruiz', '1234567890114', '1984-12-16',
    'Zona 13, Ciudad de Guatemala', '55554567', 'carmen.ruiz@empresa.com',
    4, 2, '2017-09-30', 6500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);

-- Empleado 15 - Supervisor de Operaciones
CALL sp_crear_empleado(
    'EMP015', 'Alejandro', 'Chávez', '1234567890115', '1981-11-05',
    'Zona 6, Ciudad de Guatemala', '55555678', 'alejandro.chavez@empresa.com',
    6, 2, '2016-12-01', 8500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);