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
    1, 1, '2017-01-01', 15000.00, 'QUINCENAL', '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e',
    @id_resultado, @mensaje
);



