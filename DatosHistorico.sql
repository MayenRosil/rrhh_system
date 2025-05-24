use rrhh_system;

USE rrhh_system;

-- ===================================
-- DEPARTAMENTOS Y PUESTOS ADICIONALES
-- ===================================

INSERT INTO departamentos (nombre, descripcion) VALUES 
('Marketing', 'Departamento de mercadeo y publicidad'),
('Logística', 'Gestión de inventarios y distribución'),
('Seguridad', 'Seguridad física y patrimonial'),
('Mantenimiento', 'Mantenimiento de instalaciones'),
('Calidad', 'Control de calidad y procesos');

INSERT INTO puestos (nombre, descripcion, salario_base, id_departamento) VALUES 
-- Marketing
('Gerente de Marketing', 'Responsable del departamento de marketing', 14000.00, 6),
('Analista de Marketing', 'Analista de mercadeo', 7500.00, 6),
('Community Manager', 'Gestión de redes sociales', 6000.00, 6),
-- Logística
('Gerente de Logística', 'Responsable de logística', 13000.00, 7),
('Coordinador de Inventarios', 'Control de inventarios', 8000.00, 7),
('Auxiliar de Bodega', 'Asistente de bodega', 4500.00, 7),
-- Seguridad
('Jefe de Seguridad', 'Responsable de seguridad', 9000.00, 8),
('Guardia de Seguridad', 'Personal de seguridad', 3500.00, 8),
-- Mantenimiento
('Jefe de Mantenimiento', 'Responsable de mantenimiento', 10000.00, 9),
('Técnico de Mantenimiento', 'Técnico especializado', 6500.00, 9),
-- Calidad
('Gerente de Calidad', 'Responsable de calidad', 13500.00, 10),
('Inspector de Calidad', 'Control de calidad', 7000.00, 10);

-- ===================================
-- EMPLEADOS ADICIONALES (39 más)
-- ===================================

-- Marketing
CALL sp_crear_empleado('EMP016', 'Gabriela', 'Morales', '1234567890116', '1985-03-22', 'Zona 10, Ciudad de Guatemala', '55556789', 'gabriela.morales@empresa.com', 11, 1, '2023-02-01', 14000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP017', 'Ricardo', 'Fuentes', '1234567890117', '1990-07-14', 'Zona 16, Ciudad de Guatemala', '55557890', 'ricardo.fuentes@empresa.com', 12, 2, '2023-03-15', 7500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP018', 'Sofía', 'Vargas', '1234567890118', '1994-11-30', 'Zona 12, Ciudad de Guatemala', '55558901', 'sofia.vargas@empresa.com', 13, 2, '2023-04-01', 6000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Logística
CALL sp_crear_empleado('EMP019', 'Carlos', 'Sandoval', '1234567890119', '1982-01-25', 'Zona 5, Ciudad de Guatemala', '55559012', 'carlos.sandoval@empresa.com', 14, 1, '2023-01-10', 13000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP020', 'Mónica', 'Estrada', '1234567890120', '1987-06-18', 'Villa Canales, Guatemala', '55550123', 'monica.estrada@empresa.com', 15, 2, '2023-02-20', 8000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP021', 'Óscar', 'Morán', '1234567890121', '1991-09-12', 'San Juan Sacatepéquez, Guatemala', '55551234', 'oscar.moran@empresa.com', 16, 2, '2023-05-01', 4500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP022', 'Claudia', 'Reyes', '1234567890122', '1989-04-08', 'Mixco, Guatemala', '55552345', 'claudia.reyes@empresa.com', 16, 2, '2023-06-15', 4500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Seguridad
CALL sp_crear_empleado('EMP023', 'Edgar', 'Palma', '1234567890123', '1980-12-03', 'Zona 21, Ciudad de Guatemala', '55553456', 'edgar.palma@empresa.com', 17, 1, '2023-01-15', 9000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP024', 'Julio', 'Godoy', '1234567890124', '1986-08-16', 'Zona 8, Ciudad de Guatemala', '55554567', 'julio.godoy@empresa.com', 18, 2, '2023-03-01', 3500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP025', 'Raúl', 'Carrillo', '1234567890125', '1988-02-28', 'Zona 17, Ciudad de Guatemala', '55555678', 'raul.carrillo@empresa.com', 18, 2, '2023-04-10', 3500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP026', 'Mario', 'Solórzano', '1234567890126', '1984-10-19', 'Zona 3, Ciudad de Guatemala', '55556789', 'mario.solorzano@empresa.com', 18, 2, '2023-05-20', 3500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP027', 'Víctor', 'Aguilar', '1234567890127', '1990-12-07', 'Zona 1, Ciudad de Guatemala', '55557890', 'victor.aguilar@empresa.com', 18, 2, '2023-07-01', 3500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Mantenimiento
CALL sp_crear_empleado('EMP028', 'Alfredo', 'Monzón', '1234567890128', '1983-05-14', 'Zona 4, Ciudad de Guatemala', '55558901', 'alfredo.monzon@empresa.com', 19, 1, '2023-02-05', 10000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP029', 'Ronaldo', 'Mejía', '1234567890129', '1987-01-21', 'Zona 19, Ciudad de Guatemala', '55559012', 'ronaldo.mejia@empresa.com', 20, 2, '2023-03-20', 6500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP030', 'Sergio', 'Velásquez', '1234567890130', '1985-11-15', 'Zona 20, Ciudad de Guatemala', '55550123', 'sergio.velasquez@empresa.com', 20, 2, '2023-04-25', 6500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP031', 'Héctor', 'Ramos', '1234567890131', '1989-07-09', 'San José Pinula, Guatemala', '55551234', 'hector.ramos@empresa.com', 20, 2, '2023-06-01', 6500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Calidad
CALL sp_crear_empleado('EMP032', 'Beatriz', 'Salguero', '1234567890132', '1981-04-17', 'Zona 14, Ciudad de Guatemala', '55552345', 'beatriz.salguero@empresa.com', 21, 1, '2023-01-20', 13500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP033', 'Lorena', 'Morales', '1234567890133', '1988-09-02', 'Zona 13, Ciudad de Guatemala', '55553456', 'lorena.morales@empresa.com', 22, 2, '2023-02-10', 7000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP034', 'Enrique', 'Barrios', '1234567890134', '1986-12-11', 'Zona 15, Ciudad de Guatemala', '55554567', 'enrique.barrios@empresa.com', 22, 2, '2023-03-05', 7000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP035', 'Verónica', 'Quezada', '1234567890135', '1992-06-24', 'Zona 11, Ciudad de Guatemala', '55555678', 'veronica.quezada@empresa.com', 22, 2, '2023-05-15', 7000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- TI adicionales
CALL sp_crear_empleado('EMP036', 'Andrés', 'Catalán', '1234567890136', '1993-08-13', 'Zona 7, Ciudad de Guatemala', '55556789', 'andres.catalan@empresa.com', 8, 2, '2023-07-10', 10000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP037', 'Paola', 'Montenegro', '1234567890137', '1991-03-26', 'Zona 9, Ciudad de Guatemala', '55557890', 'paola.montenegro@empresa.com', 8, 2, '2023-08-01', 9500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Ventas adicionales
CALL sp_crear_empleado('EMP038', 'Rodrigo', 'Escobar', '1234567890138', '1989-05-04', 'Zona 18, Ciudad de Guatemala', '55558901', 'rodrigo.escobar@empresa.com', 10, 2, '2023-04-15', 5200.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP039', 'Silvia', 'Cordón', '1234567890139', '1990-11-18', 'Zona 6, Ciudad de Guatemala', '55559012', 'silvia.cordon@empresa.com', 10, 2, '2023-05-30', 5000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP040', 'Manuel', 'Corado', '1234567890140', '1987-02-14', 'Zona 2, Ciudad de Guatemala', '55550123', 'manuel.corado@empresa.com', 10, 2, '2023-06-20', 5100.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Operaciones adicionales
CALL sp_crear_empleado('EMP041', 'Gladys', 'Sánchez', '1234567890141', '1986-07-29', 'Villa Nueva, Guatemala', '55551234', 'gladys.sanchez@empresa.com', 6, 2, '2023-03-10', 4200.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP042', 'Erick', 'Pineda', '1234567890142', '1988-10-05', 'San Miguel Petapa, Guatemala', '55552345', 'erick.pineda@empresa.com', 6, 2, '2023-04-05', 4100.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP043', 'Ingrid', 'Villatoro', '1234567890143', '1992-01-12', 'Amatitlán, Guatemala', '55553456', 'ingrid.villatoro@empresa.com', 6, 2, '2023-07-15', 4000.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP044', 'Javier', 'Arriola', '1234567890144', '1985-11-22', 'Fraijanes, Guatemala', '55554567', 'javier.arriola@empresa.com', 6, 2, '2023-08-20', 4300.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Contabilidad adicional
CALL sp_crear_empleado('EMP045', 'Miriam', 'Galindo', '1234567890145', '1984-08-17', 'Zona 12, Ciudad de Guatemala', '55555678', 'miriam.galindo@empresa.com', 4, 2, '2023-02-15', 6200.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- RRHH adicional
CALL sp_crear_empleado('EMP046', 'Karla', 'Rosales', '1234567890146', '1987-04-03', 'Zona 16, Ciudad de Guatemala', '55556789', 'karla.rosales@empresa.com', 2, 2, '2023-03-25', 8200.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Supervisores
CALL sp_crear_empleado('EMP047', 'Orlando', 'Marroquín', '1234567890147', '1982-09-08', 'Zona 10, Ciudad de Guatemala', '55557890', 'orlando.marroquin@empresa.com', 6, 2, '2023-01-30', 8700.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Asistentes administrativas
CALL sp_crear_empleado('EMP048', 'Elena', 'Rodríguez', '1234567890148', '1990-06-15', 'Zona 15, Ciudad de Guatemala', '55558901', 'elena.rodriguez@empresa.com', 2, 2, '2023-05-10', 7800.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);
CALL sp_crear_empleado('EMP049', 'Dulce', 'Mayorga', '1234567890149', '1988-12-20', 'Zona 14, Ciudad de Guatemala', '55559012', 'dulce.mayorga@empresa.com', 2, 2, '2023-06-05', 7500.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

-- Técnico adicional
CALL sp_crear_empleado('EMP050', 'Germán', 'Flores', '1234567890150', '1983-03-11', 'Zona 8, Ciudad de Guatemala', '55550123', 'german.flores@empresa.com', 20, 2, '2023-07-25', 6800.00, '$2a$12$N0L0gW1aScFmDGPZTQUG1uCSTWCaIPeUHee4pMkSKuCp81z.Kzs6e', @id_resultado, @mensaje);

USE rrhh_system;

-- ===================================
-- MARCAJES HISTÓRICOS MUESTRA
-- ===================================

-- Enero 2023 - Muestra de diferentes empleados
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
-- Empleados administrativos (8:00-17:00)
(1, '2023-01-02', '2023-01-02 08:00:00', '2023-01-02 17:00:00', 8.00, 'APROBADO'),
(1, '2023-01-03', '2023-01-03 08:15:00', '2023-01-03 17:15:00', 8.00, 'APROBADO'),
(1, '2023-01-04', '2023-01-04 07:45:00', '2023-01-04 16:45:00', 8.00, 'APROBADO'),
(1, '2023-01-05', '2023-01-05 08:00:00', '2023-01-05 17:00:00', 8.00, 'APROBADO'),
(1, '2023-01-06', '2023-01-06 08:30:00', '2023-01-06 17:30:00', 8.00, 'APROBADO'),

(4, '2023-01-02', '2023-01-02 08:30:00', '2023-01-02 17:30:00', 8.00, 'APROBADO'),
(4, '2023-01-03', '2023-01-03 08:00:00', '2023-01-03 17:00:00', 8.00, 'APROBADO'),
(4, '2023-01-04', '2023-01-04 08:15:00', '2023-01-04 17:15:00', 8.00, 'APROBADO'),
(4, '2023-01-05', '2023-01-05 08:10:00', '2023-01-05 17:10:00', 8.00, 'APROBADO'),
(4, '2023-01-06', '2023-01-06 08:00:00', '2023-01-06 17:00:00', 8.00, 'APROBADO'),

-- Gerentes (horario flexible)
(5, '2023-01-02', '2023-01-02 07:30:00', '2023-01-02 16:30:00', 8.00, 'APROBADO'),
(5, '2023-01-03', '2023-01-03 07:45:00', '2023-01-03 16:45:00', 8.00, 'APROBADO'),
(5, '2023-01-04', '2023-01-04 08:00:00', '2023-01-04 17:00:00', 8.00, 'APROBADO'),
(5, '2023-01-05', '2023-01-05 07:30:00', '2023-01-05 16:30:00', 8.00, 'APROBADO'),

-- Operarios (turno temprano 6:00-14:00)
(6, '2023-01-02', '2023-01-02 06:00:00', '2023-01-02 14:00:00', 8.00, 'APROBADO'),
(6, '2023-01-03', '2023-01-03 06:15:00', '2023-01-03 14:15:00', 8.00, 'APROBADO'),
(6, '2023-01-04', '2023-01-04 06:00:00', '2023-01-04 14:00:00', 8.00, 'APROBADO'),
(6, '2023-01-05', '2023-01-05 06:30:00', '2023-01-05 14:30:00', 8.00, 'APROBADO'),

-- TI (horario flexible)
(7, '2023-01-02', '2023-01-02 09:00:00', '2023-01-02 18:00:00', 8.00, 'APROBADO'),
(7, '2023-01-03', '2023-01-03 09:15:00', '2023-01-03 18:15:00', 8.00, 'APROBADO'),
(7, '2023-01-04', '2023-01-04 08:45:00', '2023-01-04 17:45:00', 8.00, 'APROBADO'),

(8, '2023-01-02', '2023-01-02 09:00:00', '2023-01-02 18:00:00', 8.00, 'APROBADO'),
(8, '2023-01-03', '2023-01-03 09:00:00', '2023-01-03 18:00:00', 8.00, 'APROBADO'),
(8, '2023-01-04', '2023-01-04 09:30:00', '2023-01-04 18:30:00', 8.00, 'APROBADO'),

-- Ventas (horario estándar)
(9, '2023-01-02', '2023-01-02 08:00:00', '2023-01-02 17:00:00', 8.00, 'APROBADO'),
(9, '2023-01-03', '2023-01-03 08:00:00', '2023-01-03 17:00:00', 8.00, 'APROBADO'),
(10, '2023-01-02', '2023-01-02 08:15:00', '2023-01-02 17:15:00', 8.00, 'APROBADO'),
(10, '2023-01-03', '2023-01-03 08:00:00', '2023-01-03 17:00:00', 8.00, 'APROBADO');

-- Febrero 2023 - Empleados nuevos
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
-- Marketing
(16, '2023-02-01', '2023-02-01 08:00:00', '2023-02-01 17:00:00', 8.00, 'APROBADO'),
(16, '2023-02-02', '2023-02-02 08:00:00', '2023-02-02 17:00:00', 8.00, 'APROBADO'),
(16, '2023-02-03', '2023-02-03 08:00:00', '2023-02-03 17:00:00', 8.00, 'APROBADO'),

-- Logística
(19, '2023-02-01', '2023-02-01 07:30:00', '2023-02-01 16:30:00', 8.00, 'APROBADO'),
(19, '2023-02-02', '2023-02-02 07:45:00', '2023-02-02 16:45:00', 8.00, 'APROBADO'),
(20, '2023-02-20', '2023-02-20 08:00:00', '2023-02-20 17:00:00', 8.00, 'APROBADO'),
(20, '2023-02-21', '2023-02-21 08:15:00', '2023-02-21 17:15:00', 8.00, 'APROBADO'),

-- Seguridad (diferentes turnos)
(23, '2023-02-01', '2023-02-01 06:00:00', '2023-02-01 14:00:00', 8.00, 'APROBADO'),
(23, '2023-02-02', '2023-02-02 14:00:00', '2023-02-02 22:00:00', 8.00, 'APROBADO'),
(23, '2023-02-03', '2023-02-03 22:00:00', '2023-02-04 06:00:00', 8.00, 'APROBADO');

-- Marzo 2023 - Más empleados
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
(17, '2023-03-15', '2023-03-15 08:30:00', '2023-03-15 17:30:00', 8.00, 'APROBADO'),
(18, '2023-03-15', '2023-03-15 09:00:00', '2023-03-15 18:00:00', 8.00, 'APROBADO'),
(21, '2023-05-01', '2023-05-01 07:45:00', '2023-05-01 15:45:00', 8.00, 'APROBADO'),
(22, '2023-06-15', '2023-06-15 08:00:00', '2023-06-15 17:00:00', 8.00, 'APROBADO'),

-- Guardias de seguridad con turnos rotativos
(24, '2023-03-01', '2023-03-01 06:00:00', '2023-03-01 14:00:00', 8.00, 'APROBADO'),
(24, '2023-03-02', '2023-03-02 14:00:00', '2023-03-02 22:00:00', 8.00, 'APROBADO'),
(24, '2023-03-03', '2023-03-03 22:00:00', '2023-03-04 06:00:00', 8.00, 'APROBADO'),

(25, '2023-04-10', '2023-04-10 14:00:00', '2023-04-10 22:00:00', 8.00, 'APROBADO'),
(25, '2023-04-11', '2023-04-11 22:00:00', '2023-04-12 06:00:00', 8.00, 'APROBADO'),
(25, '2023-04-12', '2023-04-12 06:00:00', '2023-04-12 14:00:00', 8.00, 'APROBADO'),

(26, '2023-05-20', '2023-05-20 06:00:00', '2023-05-20 14:00:00', 8.00, 'APROBADO'),
(27, '2023-07-01', '2023-07-01 22:00:00', '2023-07-02 06:00:00', 8.00, 'APROBADO');

-- Mantenimiento
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
(28, '2023-02-05', '2023-02-05 07:00:00', '2023-02-05 15:00:00', 8.00, 'APROBADO'),
(29, '2023-03-20', '2023-03-20 07:00:00', '2023-03-20 15:00:00', 8.00, 'APROBADO'),
(30, '2023-04-25', '2023-04-25 07:30:00', '2023-04-25 15:30:00', 8.00, 'APROBADO'),
(31, '2023-06-01', '2023-06-01 07:00:00', '2023-06-01 15:00:00', 8.00, 'APROBADO');

-- Calidad
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
(32, '2023-01-20', '2023-01-20 08:30:00', '2023-01-20 17:30:00', 8.00, 'APROBADO'),
(33, '2023-02-10', '2023-02-10 08:15:00', '2023-02-10 17:15:00', 8.00, 'APROBADO'),
(34, '2023-03-05', '2023-03-05 08:00:00', '2023-03-05 17:00:00', 8.00, 'APROBADO'),
(35, '2023-05-15', '2023-05-15 08:30:00', '2023-05-15 17:30:00', 8.00, 'APROBADO');

-- 2024 - Ejemplos de marcajes
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
-- Enero 2024
(1, '2024-01-02', '2024-01-02 08:00:00', '2024-01-02 17:00:00', 8.00, 'APROBADO'),
(1, '2024-01-03', '2024-01-03 08:15:00', '2024-01-03 17:15:00', 8.00, 'APROBADO'),
(4, '2024-01-02', '2024-01-02 08:30:00', '2024-01-02 17:30:00', 8.00, 'APROBADO'),
(16, '2024-01-02', '2024-01-02 08:00:00', '2024-01-02 17:00:00', 8.00, 'APROBADO'),
(19, '2024-01-02', '2024-01-02 07:30:00', '2024-01-02 16:30:00', 8.00, 'APROBADO'),

-- Abril 2024
(36, '2024-04-10', '2024-04-10 09:00:00', '2024-04-10 18:00:00', 8.00, 'APROBADO'),
(37, '2024-04-10', '2024-04-10 09:15:00', '2024-04-10 18:15:00', 8.00, 'APROBADO'),
(38, '2024-04-10', '2024-04-10 08:00:00', '2024-04-10 17:00:00', 8.00, 'APROBADO'),
(39, '2024-04-10', '2024-04-10 08:30:00', '2024-04-10 17:30:00', 8.00, 'APROBADO'),
(40, '2024-04-10', '2024-04-10 08:15:00', '2024-04-10 17:15:00', 8.00, 'APROBADO'),

-- Julio 2024
(45, '2024-07-15', '2024-07-15 08:00:00', '2024-07-15 17:00:00', 8.00, 'APROBADO'),
(31, '2024-07-15', '2024-07-15 07:00:00', '2024-07-15 15:00:00', 8.00, 'APROBADO'),
(27, '2024-07-15', '2024-07-15 22:00:00', '2024-07-16 06:00:00', 8.00, 'APROBADO'),

-- Operarios 2024
(41, '2024-03-10', '2024-03-10 06:00:00', '2024-03-10 14:00:00', 8.00, 'APROBADO'),
(43, '2024-07-15', '2024-07-15 06:00:00', '2024-07-15 14:00:00', 8.00, 'APROBADO'),
(44, '2024-08-20', '2024-08-20 06:30:00', '2024-08-20 14:30:00', 8.00, 'APROBADO');

-- 2025 - Marcajes actuales
INSERT INTO marcajes (id_empleado, fecha, hora_entrada, hora_salida, horas_trabajadas, estado) VALUES
-- Mayo 2025 - Algunos días
(1, '2025-05-01', '2025-05-01 08:00:00', '2025-05-01 17:00:00', 8.00, 'APROBADO'),
(1, '2025-05-02', '2025-05-02 08:15:00', '2025-05-02 17:15:00', 8.00, 'APROBADO'),
(4, '2025-05-01', '2025-05-01 08:30:00', '2025-05-01 17:30:00', 8.00, 'APROBADO'),
(5, '2025-05-01', '2025-05-01 07:45:00', '2025-05-01 16:45:00', 8.00, 'APROBADO'),
(16, '2025-05-01', '2025-05-01 08:00:00', '2025-05-01 17:00:00', 8.00, 'APROBADO'),
(19, '2025-05-01', '2025-05-01 07:30:00', '2025-05-01 16:30:00', 8.00, 'APROBADO'),
(23, '2025-05-01', '2025-05-01 06:00:00', '2025-05-01 14:00:00', 8.00, 'APROBADO'),
(28, '2025-05-01', '2025-05-01 07:00:00', '2025-05-01 15:00:00', 8.00, 'APROBADO'),
(32, '2025-05-01', '2025-05-01 08:30:00', '2025-05-01 17:30:00', 8.00, 'APROBADO'),

-- Marcajes pendientes (sin salida - empleados que están trabajando hoy)
(8, '2025-05-24', '2025-05-24 09:00:00', NULL, NULL, 'PENDIENTE'),
(17, '2025-05-24', '2025-05-24 08:30:00', NULL, NULL, 'PENDIENTE'),
(20, '2025-05-24', '2025-05-24 08:00:00', NULL, NULL, 'PENDIENTE'),
(33, '2025-05-24', '2025-05-24 08:15:00', NULL, NULL, 'PENDIENTE'),
(46, '2025-05-24', '2025-05-24 08:00:00', NULL, NULL, 'PENDIENTE');

-- ===================================
-- OBSERVACIONES EN MARCAJES
-- ===================================

-- Agregar observaciones a algunos marcajes
UPDATE marcajes SET observaciones = 'Llegada tarde justificada - cita médica' 
WHERE id_empleado = 4 AND fecha = '2023-01-02';

UPDATE marcajes SET observaciones = 'Turno nocturno de seguridad' 
WHERE id_empleado IN (23, 25, 27) AND HOUR(hora_entrada) = 22;

UPDATE marcajes SET observaciones = 'Horario flexible aprobado por gerencia' 
WHERE id_empleado IN (7, 8, 36, 37) AND HOUR(hora_entrada) = 9;

UPDATE marcajes SET observaciones = 'Turno operativo matutino' 
WHERE id_empleado IN (6, 41, 43, 44) AND HOUR(hora_entrada) = 6;


USE rrhh_system;

-- ===================================
-- SOLICITUDES DE VACACIONES HISTÓRICAS
-- ===================================

-- Vacaciones 2023
CALL sp_solicitar_vacaciones(1, '2023-06-15', '2023-06-29', 'Vacaciones de medio año', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(5, '2023-07-10', '2023-07-17', 'Vacaciones familiares', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(8, '2023-08-01', '2023-08-10', 'Descanso anual', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(9, '2023-05-15', '2023-05-22', 'Vacaciones familiares', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(10, '2023-11-06', '2023-11-10', 'Días de descanso', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(16, '2023-12-20', '2023-12-29', 'Vacaciones de fin de año', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(17, '2023-04-03', '2023-04-07', 'Vacaciones de Semana Santa', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(18, '2023-08-14', '2023-08-18', 'Vacaciones de verano', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

-- Vacaciones 2024
CALL sp_solicitar_vacaciones(7, '2024-01-15', '2024-01-22', 'Vacaciones de inicio de año', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(11, '2024-02-12', '2024-02-16', 'Vacaciones cortas', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(19, '2024-03-18', '2024-03-25', 'Semana Santa', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(13, '2024-04-01', '2024-04-05', 'Semana Santa', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(22, '2024-05-01', '2024-05-03', 'Día del trabajador extendido', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(29, '2024-06-24', '2024-06-28', 'Vacaciones personales', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(32, '2024-07-01', '2024-07-12', 'Vacaciones de verano', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(12, '2024-08-05', '2024-08-16', 'Vacaciones de verano', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(23, '2024-09-15', '2024-09-20', 'Descanso personal', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(31, '2024-09-16', '2024-09-20', 'Celebración patria', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(14, '2024-10-14', '2024-10-18', 'Descanso personal', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(28, '2024-11-25', '2024-12-02', 'Vacaciones de fin de año', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

CALL sp_solicitar_vacaciones(15, '2024-12-23', '2025-01-02', 'Vacaciones de fin de año', @id_vacacion, @resultado, @mensaje);
CALL sp_aprobar_vacaciones(LAST_INSERT_ID(), @resultado, @mensaje);

-- Vacaciones 2025 - Algunas solicitudes
CALL sp_solicitar_vacaciones(20, '2025-06-15', '2025-06-22', 'Vacaciones planeadas', @id_vacacion, @resultado, @mensaje);
-- Esta se deja como SOLICITADO (pendiente de aprobación)

CALL sp_solicitar_vacaciones(21, '2025-07-01', '2025-07-10', 'Descanso verano', @id_vacacion, @resultado, @mensaje);
-- Rechazar esta solicitud
UPDATE vacaciones SET estado = 'RECHAZADO', observaciones = 'Periodo muy ocupado, solicitar en otra fecha' WHERE id_vacacion = LAST_INSERT_ID();
