
USE rrhh_system;

-- -----------------------------

DELIMITER //

CREATE PROCEDURE `sp_actualizar_empleado`(
    IN p_id_empleado INT,
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_direccion VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_id_puesto INT,
    IN p_id_rol INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al actualizar el empleado';
    END;
    
    START TRANSACTION;
    
    -- Validar que exista el empleado
    IF NOT EXISTS (SELECT 1 FROM empleados WHERE id_empleado = p_id_empleado) THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
    ELSE
        -- Actualizar el empleado
        UPDATE empleados SET
            nombre = p_nombre,
            apellido = p_apellido,
            direccion = p_direccion,
            telefono = p_telefono,
            email = p_email,
            id_puesto = p_id_puesto,
            id_rol = p_id_rol
        WHERE id_empleado = p_id_empleado;
        
        SET p_resultado = TRUE;
        SET p_mensaje = 'Empleado actualizado exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_actualizar_salario`(
    IN p_id_empleado INT,
    IN p_salario_nuevo DECIMAL(10,2),
    IN p_motivo VARCHAR(255),
    IN p_id_usuario_modificacion INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_salario_actual DECIMAL(10,2);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al actualizar el salario';
    END;
    
    START TRANSACTION;
    
    -- Obtener el salario actual
    SELECT salario_actual INTO v_salario_actual 
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    -- Validar que exista el empleado
    IF v_salario_actual IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
    ELSE
        -- Actualizar el salario del empleado
        UPDATE empleados 
        SET salario_actual = p_salario_nuevo
        WHERE id_empleado = p_id_empleado;
        
        -- Registrar en histórico de salarios
        INSERT INTO historico_salarios (
            id_empleado, salario_anterior, salario_nuevo, fecha_cambio, 
            motivo, id_usuario_modificacion
        ) VALUES (
            p_id_empleado, v_salario_actual, p_salario_nuevo, CURDATE(), 
            p_motivo, p_id_usuario_modificacion
        );
        
        SET p_resultado = TRUE;
        SET p_mensaje = 'Salario actualizado exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_aprobar_vacaciones`(
    IN p_id_vacacion INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_id_empleado INT;
    DECLARE v_dias_tomados INT;
    DECLARE v_estado ENUM('SOLICITADO', 'APROBADO', 'RECHAZADO', 'CANCELADO', 'TERMINADO');
    DECLARE v_dias_disponibles INT DEFAULT 0;
    DECLARE v_dias_pendientes INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al aprobar las vacaciones';
    END;
    
    START TRANSACTION;
    
    -- Obtener datos de la vacación
    SELECT v.id_empleado, v.dias_tomados, v.estado
    INTO v_id_empleado, v_dias_tomados, v_estado
    FROM vacaciones v
    WHERE v.id_vacacion = p_id_vacacion;
    
    IF v_id_empleado IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe la solicitud de vacaciones indicada';
        ROLLBACK;
    ELSEIF v_estado != 'SOLICITADO' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'La solicitud no está en estado Solicitado';
        ROLLBACK;
    ELSE
        -- Verificar días disponibles nuevamente
        SELECT SUM(dias_pendientes) INTO v_dias_disponibles
        FROM periodos_vacacionales
        WHERE id_empleado = v_id_empleado AND estado = 'ACTIVO';
        
        IF v_dias_tomados > v_dias_disponibles THEN
            SET p_resultado = FALSE;
            SET p_mensaje = CONCAT('No hay suficientes días disponibles. Solicitados: ', 
                                 v_dias_tomados, '. Disponibles: ', v_dias_disponibles);
            ROLLBACK;
        ELSE
            -- Actualizar el estado de la solicitud
            UPDATE vacaciones
            SET estado = 'APROBADO'
            WHERE id_vacacion = p_id_vacacion;
            
            -- Descontar los días de los períodos vacacionales (del más antiguo al más reciente)
            SET v_dias_pendientes = v_dias_tomados;
            
            WHILE v_dias_pendientes > 0 DO
                UPDATE periodos_vacacionales
                SET 
                    dias_tomados = dias_tomados + 
                        LEAST(dias_pendientes, v_dias_pendientes),
                    dias_pendientes = dias_pendientes - 
                        LEAST(dias_pendientes, v_dias_pendientes)
                WHERE id_empleado = v_id_empleado 
                AND estado = 'ACTIVO'
                AND dias_pendientes > 0
                ORDER BY fecha_inicio ASC
                LIMIT 1;
                
                SET v_dias_pendientes = v_dias_pendientes - 
                    LEAST((SELECT dias_pendientes FROM periodos_vacacionales 
                          WHERE id_empleado = v_id_empleado 
                          AND estado = 'ACTIVO'
                          AND dias_pendientes > 0
                          ORDER BY fecha_inicio ASC
                          LIMIT 1), v_dias_pendientes);
            END WHILE;
            
            SET p_resultado = TRUE;
            SET p_mensaje = 'Vacaciones aprobadas exitosamente';
            COMMIT;
        END IF;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_baja_empleado`(
    IN p_id_empleado INT,
    IN p_fecha_fin DATE,
    IN p_motivo ENUM('DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'RENUNCIA', 'MUTUO_ACUERDO', 'FALLECIMIENTO'),
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_estado VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al dar de baja al empleado';
    END;
    
    START TRANSACTION;
    
    -- Obtener el estado actual del empleado
    SELECT estado INTO v_estado 
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    -- Validar que exista el empleado y esté activo
    IF v_estado IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
    ELSEIF v_estado != 'ACTIVO' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'El empleado no está activo actualmente';
        ROLLBACK;
    ELSE
        -- Actualizar el estado del empleado
        UPDATE empleados 
        SET 
            fecha_fin_contrato = p_fecha_fin,
            estado = CASE 
                WHEN p_motivo = 'DESPIDO_JUSTIFICADO' OR p_motivo = 'DESPIDO_INJUSTIFICADO' THEN 'DESPEDIDO'
                WHEN p_motivo = 'RENUNCIA' THEN 'RENUNCIA'
                ELSE 'INACTIVO'
            END
        WHERE id_empleado = p_id_empleado;
        
        -- Cerrar períodos vacacionales activos
        UPDATE periodos_vacacionales
        SET estado = 'CERRADO'
        WHERE id_empleado = p_id_empleado AND estado = 'ACTIVO';
        
        SET p_resultado = TRUE;
        SET p_mensaje = 'Empleado dado de baja exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_calcular_liquidacion`(
    IN p_id_empleado INT,
    IN p_fecha_liquidacion DATE,
    IN p_motivo ENUM('DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'RENUNCIA', 'MUTUO_ACUERDO', 'FALLECIMIENTO'),
    OUT p_id_liquidacion INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
sp_calcular_liquidacion: BEGIN
    DECLARE v_fecha_contratacion DATE;
    DECLARE v_salario_actual DECIMAL(10,2);
    DECLARE v_anos_laborados DECIMAL(5,2);
    DECLARE v_indemnizacion DECIMAL(10,2) DEFAULT 0;
    DECLARE v_aguinaldo_proporcional DECIMAL(10,2);
    DECLARE v_bono14_proporcional DECIMAL(10,2);
    DECLARE v_vacaciones_pendientes DECIMAL(10,2) DEFAULT 0;
    DECLARE v_total_liquidacion DECIMAL(10,2);
    DECLARE v_dias_vacaciones_pendientes INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al calcular la liquidación';
    END;
    
    START TRANSACTION;
    
    -- Obtener datos del empleado
    SELECT 
        fecha_contratacion, 
        salario_actual
    INTO 
        v_fecha_contratacion, 
        v_salario_actual
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    -- Verificar que exista el empleado
    IF v_fecha_contratacion IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
        LEAVE sp_calcular_liquidacion;
    END IF;
    
    -- Calcular años laborados
    SET v_anos_laborados = TIMESTAMPDIFF(DAY, v_fecha_contratacion, p_fecha_liquidacion) / 365.25;
    
    -- Calcular indemnización (solo en caso de despido injustificado)
    IF p_motivo = 'DESPIDO_INJUSTIFICADO' THEN
        SET v_indemnizacion = v_salario_actual * v_anos_laborados;
    END IF;
    
    -- Calcular aguinaldo proporcional (del 1 de diciembre al 30 de noviembre)
    -- Simplificación: se calcula proporcionalmente al tiempo transcurrido del año
    SET v_aguinaldo_proporcional = v_salario_actual * 
        (TIMESTAMPDIFF(DAY, 
            GREATEST(v_fecha_contratacion, DATE_SUB(p_fecha_liquidacion, INTERVAL 1 YEAR)), 
            p_fecha_liquidacion) / 365.0);
    
    -- Calcular Bono 14 proporcional (del 1 de julio al 30 de junio)
    -- Simplificación: se calcula proporcionalmente al tiempo transcurrido del año
    SET v_bono14_proporcional = v_salario_actual * 
        (TIMESTAMPDIFF(DAY, 
            GREATEST(v_fecha_contratacion, DATE_SUB(p_fecha_liquidacion, INTERVAL 1 YEAR)), 
            p_fecha_liquidacion) / 365.0);
    
    -- Calcular vacaciones pendientes
    SELECT SUM(dias_pendientes) INTO v_dias_vacaciones_pendientes
    FROM periodos_vacacionales
    WHERE id_empleado = p_id_empleado AND estado IN ('ACTIVO', 'CERRADO');
    
    IF v_dias_vacaciones_pendientes > 0 THEN
        SET v_vacaciones_pendientes = (v_salario_actual / 30) * v_dias_vacaciones_pendientes;
    END IF;
    
    -- Calcular total de liquidación
    SET v_total_liquidacion = v_indemnizacion + v_aguinaldo_proporcional + 
                             v_bono14_proporcional + v_vacaciones_pendientes;
    
    -- Insertar liquidación
    INSERT INTO liquidaciones (
        id_empleado, fecha_liquidacion, motivo, anos_laborados, 
        salario_promedio, indemnizacion, aguinaldo_proporcional, 
        bono14_proporcional, vacaciones_pendientes, total_liquidacion
    ) VALUES (
        p_id_empleado, p_fecha_liquidacion, p_motivo, v_anos_laborados, 
        v_salario_actual, v_indemnizacion, v_aguinaldo_proporcional, 
        v_bono14_proporcional, v_vacaciones_pendientes, v_total_liquidacion
    );
    
    SET p_id_liquidacion = LAST_INSERT_ID();
    
    -- Actualizar períodos vacacionales
    UPDATE periodos_vacacionales
    SET estado = 'LIQUIDADO'
    WHERE id_empleado = p_id_empleado AND estado IN ('ACTIVO', 'CERRADO');
    
    SET p_resultado = TRUE;
    SET p_mensaje = 'Liquidación calculada exitosamente';
    COMMIT;
END //

-- -----------------------------------------------------------------

DELIMITER //

CREATE PROCEDURE `sp_calcular_nomina_empleado`(
    IN p_id_empleado INT,
    IN p_id_periodo INT,
    OUT p_id_nomina INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
sp_calcular_nomina_empleado: BEGIN
    DECLARE v_tipo_periodo ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL');
    DECLARE v_fecha_inicio DATE;
    DECLARE v_fecha_fin DATE;
    DECLARE v_salario_base DECIMAL(10,2);
    DECLARE dias_entre INT;
    DECLARE v_salario_devengado DECIMAL(10,2);
    DECLARE v_total_deducciones DECIMAL(10,2) DEFAULT 0;
    DECLARE v_total_bonificaciones DECIMAL(10,2) DEFAULT 0;
    DECLARE v_sueldo_liquido DECIMAL(10,2);
    DECLARE v_tasa_igss DECIMAL(10,4);
    DECLARE v_tasa_isr DECIMAL(10,4);
    DECLARE v_bonificacion_incentivo DECIMAL(10,2);
    DECLARE v_monto_igss DECIMAL(10,2);
    DECLARE v_monto_isr DECIMAL(10,2);
    DECLARE v_ya_calculado BOOLEAN DEFAULT FALSE;
    DECLARE v_id_tipo_deduccion_igss INT;
    DECLARE v_id_tipo_deduccion_isr INT;
    DECLARE v_id_tipo_bonificacion_incentivo INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al calcular la nómina';
    END;

    START TRANSACTION;

    -- Obtener información del período
    SELECT tipo, fecha_inicio, fecha_fin 
    INTO v_tipo_periodo, v_fecha_inicio, v_fecha_fin
    FROM periodos_nomina 
    WHERE id_periodo = p_id_periodo;

    IF v_tipo_periodo IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el período de nómina indicado';
        ROLLBACK;
        LEAVE sp_calcular_nomina_empleado;
    END IF;

    -- Obtener información del empleado
    SELECT salario_actual 
    INTO v_salario_base
    FROM empleados 
    WHERE id_empleado = p_id_empleado AND estado = 'ACTIVO';

    IF v_salario_base IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No se encontró el salario del empleado o el empleado no está activo';
        ROLLBACK;
        LEAVE sp_calcular_nomina_empleado;
    END IF;

    -- Verificar si ya existe una nómina calculada
    SELECT EXISTS (
        SELECT 1 FROM nominas 
        WHERE id_empleado = p_id_empleado AND id_periodo = p_id_periodo
    ) INTO v_ya_calculado;

    IF v_ya_calculado THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'Ya existe una nómina calculada para este empleado en este período';
        ROLLBACK;
        LEAVE sp_calcular_nomina_empleado;
    END IF;

    -- Obtener parámetros del sistema
    SELECT valor INTO v_tasa_igss
    FROM parametros_sistema
    WHERE nombre = 'TASA_IGSS' AND activo = TRUE
    ORDER BY fecha_inicio DESC
    LIMIT 1;

    SELECT valor INTO v_tasa_isr
    FROM parametros_sistema
    WHERE nombre = 'TASA_ISR' AND activo = TRUE
    ORDER BY fecha_inicio DESC
    LIMIT 1;

    SELECT valor INTO v_bonificacion_incentivo
    FROM parametros_sistema
    WHERE nombre = 'BONIFICACION_INCENTIVO' AND activo = TRUE
    ORDER BY fecha_inicio DESC
    LIMIT 1;

    IF v_tasa_igss IS NULL OR v_tasa_isr IS NULL OR v_bonificacion_incentivo IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No se encontraron todos los parámetros necesarios para el cálculo';
        ROLLBACK;
        LEAVE sp_calcular_nomina_empleado;
    END IF;

    -- Obtener IDs de deducciones y bonificaciones
    SELECT id_tipo_deduccion INTO v_id_tipo_deduccion_igss
    FROM tipos_deducciones
    WHERE nombre = 'IGSS' AND activo = TRUE
    LIMIT 1;

    SELECT id_tipo_deduccion INTO v_id_tipo_deduccion_isr
    FROM tipos_deducciones
    WHERE nombre = 'ISR' AND activo = TRUE
    LIMIT 1;

    SELECT id_tipo_bonificacion INTO v_id_tipo_bonificacion_incentivo
    FROM tipos_bonificaciones
    WHERE nombre = 'BONIFICACION_INCENTIVO' AND activo = TRUE
    LIMIT 1;

    -- Calcular días del período
    SET dias_entre = DATEDIFF(v_fecha_fin, v_fecha_inicio) + 1;

    -- Calcular salario devengado
    CASE v_tipo_periodo
        WHEN 'MENSUAL' THEN 
            SET v_salario_devengado = v_salario_base;
        WHEN 'QUINCENAL' THEN 
            SET v_salario_devengado = v_salario_base / 2;
        WHEN 'SEMANAL' THEN 
            SET v_salario_devengado = (v_salario_base / 30) * dias_entre;
    END CASE;

    -- Calcular deducciones
    SET v_monto_igss = v_salario_devengado * v_tasa_igss;
    SET v_monto_isr = v_salario_devengado * v_tasa_isr;
    SET v_total_deducciones = v_monto_igss + v_monto_isr;

    -- Calcular bonificaciones
    CASE v_tipo_periodo
        WHEN 'MENSUAL' THEN 
            SET v_total_bonificaciones = v_bonificacion_incentivo;
        WHEN 'QUINCENAL' THEN 
            SET v_total_bonificaciones = v_bonificacion_incentivo / 2;
        WHEN 'SEMANAL' THEN 
            SET v_total_bonificaciones = (v_bonificacion_incentivo / 30) * dias_entre;
    END CASE;

    -- Calcular sueldo líquido
    SET v_sueldo_liquido = v_salario_devengado - v_total_deducciones + v_total_bonificaciones;

    -- Insertar nómina
    INSERT INTO nominas (
        id_periodo, id_empleado, salario_base, horas_trabajadas,
        salario_devengado, total_deducciones, total_bonificaciones, sueldo_liquido
    ) VALUES (
        p_id_periodo, p_id_empleado, v_salario_base, 8,
        v_salario_devengado, v_total_deducciones, v_total_bonificaciones, v_sueldo_liquido
    );

    SET p_id_nomina = LAST_INSERT_ID();

    -- Insertar deducciones
    INSERT INTO deducciones_nomina (id_nomina, id_tipo_deduccion, monto)
    VALUES (p_id_nomina, v_id_tipo_deduccion_igss, v_monto_igss),
           (p_id_nomina, v_id_tipo_deduccion_isr, v_monto_isr);

    -- Insertar bonificaciones
    INSERT INTO bonificaciones_nomina (id_nomina, id_tipo_bonificacion, monto)
    VALUES (p_id_nomina, v_id_tipo_bonificacion_incentivo, v_total_bonificaciones);

    SET p_resultado = TRUE;
    SET p_mensaje = 'Nómina calculada exitosamente';
    COMMIT;
END //



-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_crear_empleado`(
    IN p_codigo_empleado VARCHAR(20),
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_dpi VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_direccion VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_id_puesto INT,
    IN p_id_rol INT,
    IN p_fecha_contratacion DATE,
    IN p_salario_actual DECIMAL(10,2),
    IN p_password VARCHAR(255),
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
	  DECLARE v_anios      INT;
		  DECLARE v_meses      INT;
		  DECLARE v_vacaciones INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = 0;
        SET p_mensaje = 'Error al crear el empleado';
    END;
    
    START TRANSACTION;
    
    -- Validar que no exista un empleado con el mismo DPI o código
    IF EXISTS (SELECT 1 FROM empleados WHERE dpi = p_dpi) THEN
        SET p_resultado = 0;
        SET p_mensaje = 'Ya existe un empleado con el mismo DPI';
        ROLLBACK;
    ELSEIF EXISTS (SELECT 1 FROM empleados WHERE codigo_empleado = p_codigo_empleado) THEN
        SET p_resultado = 0;
        SET p_mensaje = 'Ya existe un empleado con el mismo código';
        ROLLBACK;
    ELSE
        -- Insertar el nuevo empleado
        INSERT INTO empleados (
            codigo_empleado, nombre, apellido, dpi, fecha_nacimiento, 
            direccion, telefono, email, id_puesto, id_rol, 
            fecha_contratacion, salario_actual, password
        ) VALUES (
            p_codigo_empleado, p_nombre, p_apellido, p_dpi, p_fecha_nacimiento,
            p_direccion, p_telefono, p_email, p_id_puesto, p_id_rol,
            p_fecha_contratacion, p_salario_actual, p_password
        );
        
        -- Registrar en histórico de salarios
        INSERT INTO historico_salarios (
            id_empleado, salario_anterior, salario_nuevo, fecha_cambio, motivo
        ) VALUES (
            LAST_INSERT_ID(), 0, p_salario_actual, p_fecha_contratacion, 'Contratación Inicial'
        );
        
        -- Crear período vacacional inicial
		  -- Cálculo de días de vacaciones según antigüedad
	

		  SET v_anios  = TIMESTAMPDIFF(YEAR, p_fecha_contratacion, CURDATE());
		  SET v_meses  = TIMESTAMPDIFF(MONTH, p_fecha_contratacion, CURDATE()) - v_anios * 12;
		  SET v_vacaciones = v_anios * 15 + FLOOR(v_meses * 1.25);
		  IF v_vacaciones < 0 THEN
			SET v_vacaciones = 0;
		  END IF;
        INSERT INTO periodos_vacacionales (
            id_empleado, fecha_inicio, fecha_fin, dias_correspondientes, dias_tomados, dias_pendientes
        ) VALUES (
            LAST_INSERT_ID(), p_fecha_contratacion, DATE_ADD(p_fecha_contratacion, INTERVAL 1 YEAR), v_vacaciones, 0, v_vacaciones
        );
        
        SET p_resultado = LAST_INSERT_ID();
        SET p_mensaje = 'Empleado creado exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_crear_periodo_nomina`(
    IN p_tipo ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL'),
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    OUT p_id_periodo INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al crear el período de nómina';
    END;
    
    START TRANSACTION;
    
    -- Validar que no exista un período que se solape con las fechas
    IF EXISTS (
        SELECT 1 FROM periodos_nomina 
        WHERE tipo = p_tipo 
        AND ((p_fecha_inicio BETWEEN fecha_inicio AND fecha_fin) 
            OR (p_fecha_fin BETWEEN fecha_inicio AND fecha_fin)
            OR (fecha_inicio BETWEEN p_fecha_inicio AND p_fecha_fin))
    ) THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'Ya existe un período de nómina que se solapa con las fechas indicadas';
        ROLLBACK;
    ELSE
        -- Insertar el nuevo período
        INSERT INTO periodos_nomina (tipo, fecha_inicio, fecha_fin)
        VALUES (p_tipo, p_fecha_inicio, p_fecha_fin);
        
        SET p_id_periodo = LAST_INSERT_ID();
        SET p_resultado = TRUE;
        SET p_mensaje = 'Período de nómina creado exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_pagar_nomina`(
    IN p_id_nomina INT,
    IN p_fecha_pago DATE,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_estado ENUM('PENDIENTE', 'PAGADO', 'ANULADO');
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al pagar la nómina';
    END;
    
    START TRANSACTION;
    
    -- Verificar estado actual
    SELECT estado INTO v_estado
    FROM nominas
    WHERE id_nomina = p_id_nomina;
    
    IF v_estado IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe la nómina indicada';
        ROLLBACK;
    ELSEIF v_estado != 'PENDIENTE' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'La nómina no está en estado pendiente de pago';
        ROLLBACK;
    ELSE
        -- Actualizar estado
        UPDATE nominas
        SET 
            estado = 'PAGADO',
            fecha_pago = p_fecha_pago
        WHERE id_nomina = p_id_nomina;
        
        SET p_resultado = TRUE;
        SET p_mensaje = 'Nómina pagada exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_procesar_periodo_nomina`(
    IN p_id_periodo INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
sp_procesar_periodo_nomina: BEGIN
    DECLARE v_id_empleado INT;
    DECLARE v_tipo_periodo ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL');
    DECLARE v_estado_periodo ENUM('ABIERTO', 'CERRADO', 'PROCESADO');
    DECLARE v_finished INT DEFAULT 0;
    DECLARE v_error_count INT DEFAULT 0;
    DECLARE v_success_count INT DEFAULT 0;
    DECLARE v_id_nomina INT;
    DECLARE v_resultado_emp BOOLEAN;
    DECLARE v_mensaje_emp VARCHAR(255);
    
    -- Cursor para recorrer los empleados activos con el tipo de pago correspondiente
    DECLARE cur_empleados CURSOR FOR
        SELECT e.id_empleado
        FROM empleados e
        WHERE e.estado = 'ACTIVO';
    
    -- Manejador para cuando no hay más registros
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    
    -- Manejador para errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al procesar el período de nómina';
    END;
    
    START TRANSACTION;
    
    -- Obtener tipo y estado del período
    SELECT tipo, estado INTO v_tipo_periodo, v_estado_periodo
    FROM periodos_nomina
    WHERE id_periodo = p_id_periodo;
    
    IF v_tipo_periodo IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el período de nómina indicado';
        ROLLBACK;
        LEAVE sp_procesar_periodo_nomina;
    END IF;
    
    IF v_estado_periodo != 'ABIERTO' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'El período de nómina no está abierto para procesamiento';
        ROLLBACK;
        LEAVE sp_procesar_periodo_nomina;
    END IF;
    
    -- Aprobar todos los marcajes pendientes del período
    UPDATE marcajes m
    JOIN periodos_nomina p ON m.fecha BETWEEN p.fecha_inicio AND p.fecha_fin
    SET m.estado = 'APROBADO'
    WHERE p.id_periodo = p_id_periodo AND m.estado = 'PENDIENTE';
    
    -- Abrir cursor y procesar empleados
    OPEN cur_empleados;
    
    emp_loop: LOOP
        FETCH cur_empleados INTO v_id_empleado;
        
        IF v_finished = 1 THEN
            LEAVE emp_loop;
        END IF;
        
        -- Llamar al procedimiento de cálculo de nómina para el empleado
        CALL sp_calcular_nomina_empleado(
            v_id_empleado, p_id_periodo, 
            v_id_nomina, v_resultado_emp, v_mensaje_emp
        );
        
        IF v_resultado_emp THEN
            SET v_success_count = v_success_count + 1;
        ELSE
            SET v_error_count = v_error_count + 1;
        END IF;
    END LOOP;
    
    CLOSE cur_empleados;
    
    -- Actualizar estado del período
    UPDATE periodos_nomina
    SET estado = 'PROCESADO'
    WHERE id_periodo = p_id_periodo;
    
    SET p_resultado = TRUE;
    SET p_mensaje = CONCAT('Período procesado exitosamente. Nóminas calculadas: ', 
                          v_success_count, '. Errores: ', v_error_count);
    COMMIT;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_registrar_entrada`(
    IN p_id_empleado INT,
    OUT p_id_marcaje INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_estado VARCHAR(20);
    DECLARE v_ya_marco BOOLEAN DEFAULT FALSE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al registrar la entrada';
    END;
    
    START TRANSACTION;
    
    -- Verificar que el empleado esté activo
    SELECT estado INTO v_estado 
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    IF v_estado IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
    ELSEIF v_estado != 'ACTIVO' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'El empleado no está activo actualmente';
        ROLLBACK;
    ELSE
        -- Verificar si ya marcó entrada para hoy
        SELECT EXISTS (
            SELECT 1 FROM marcajes 
            WHERE id_empleado = p_id_empleado 
            AND DATE(hora_entrada) = CURDATE()
            AND hora_salida IS NULL
        ) INTO v_ya_marco;
        
        IF v_ya_marco THEN
            SET p_resultado = FALSE;
            SET p_mensaje = 'El empleado ya registró su entrada hoy y no ha marcado salida';
            ROLLBACK;
        ELSE
            -- Registrar entrada
            INSERT INTO marcajes (id_empleado, fecha, hora_entrada)
            VALUES (p_id_empleado, CURDATE(), NOW());
            -- Continuación del procedimiento para registrar marcaje de entrada
            SET p_id_marcaje = LAST_INSERT_ID();
            SET p_resultado = TRUE;
            SET p_mensaje = 'Entrada registrada exitosamente';
            COMMIT;
        END IF;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_registrar_salida`(
    IN p_id_empleado INT,
    OUT p_id_marcaje INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_id_marcaje INT;
    DECLARE v_hora_entrada DATETIME;
    DECLARE v_horas_trabajadas DECIMAL(5,2);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al registrar la salida';
    END;
    
    START TRANSACTION;
    
    -- Buscar el marcaje de entrada sin salida registrada
    SELECT id_marcaje, hora_entrada INTO v_id_marcaje, v_hora_entrada
    FROM marcajes 
    WHERE id_empleado = p_id_empleado 
    AND DATE(hora_entrada) = CURDATE()
    AND hora_salida IS NULL
    LIMIT 1;
    
    IF v_id_marcaje IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No hay una entrada registrada sin salida para hoy';
        ROLLBACK;
    ELSE
        -- Calcular horas trabajadas
        SET v_horas_trabajadas = TIMESTAMPDIFF(SECOND, v_hora_entrada, NOW()) / 3600.0;
        
        -- Actualizar el marcaje con la salida
        UPDATE marcajes 
        SET 
            hora_salida = NOW(),
            horas_trabajadas = v_horas_trabajadas
        WHERE id_marcaje = v_id_marcaje;
        
        SET p_id_marcaje = v_id_marcaje;
        SET p_resultado = TRUE;
        SET p_mensaje = 'Salida registrada exitosamente';
        COMMIT;
    END IF;
END //

-- -----------------------------------------------------------------

CREATE PROCEDURE `sp_solicitar_vacaciones`(
    IN p_id_empleado INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_observaciones VARCHAR(255),
    OUT p_id_vacacion INT,
    OUT p_resultado BOOLEAN,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_dias_solicitados INT;
    DECLARE v_dias_disponibles INT DEFAULT 0;
    DECLARE v_estado VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = FALSE;
        SET p_mensaje = 'Error al solicitar las vacaciones';
    END;
    
    START TRANSACTION;
    
    -- Verificar que el empleado esté activo
    SELECT estado INTO v_estado 
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    IF v_estado IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'No existe el empleado con el ID proporcionado';
        ROLLBACK;
    ELSEIF v_estado != 'ACTIVO' THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'El empleado no está activo actualmente';
        ROLLBACK;
    ELSE
        -- Calcular días solicitados (sin contar fines de semana)
        SET v_dias_solicitados = DATEDIFF(p_fecha_fin, p_fecha_inicio) + 1
            - (FLOOR((DATEDIFF(p_fecha_fin, p_fecha_inicio) + 1) / 7) * 2)  -- Restar fines de semana
            - (CASE WHEN DAYOFWEEK(p_fecha_inicio) = 1 THEN 1 ELSE 0 END)  -- Restar domingo inicial si aplica
            - (CASE WHEN DAYOFWEEK(p_fecha_fin) = 7 THEN 1 ELSE 0 END);    -- Restar sábado final si aplica
        
        -- Obtener días disponibles
        SELECT SUM(dias_pendientes) INTO v_dias_disponibles
        FROM periodos_vacacionales
        WHERE id_empleado = p_id_empleado AND estado = 'ACTIVO';
        
        IF v_dias_solicitados <= 0 THEN
            SET p_resultado = FALSE;
            SET p_mensaje = 'El rango de fechas no es válido';
            ROLLBACK;
        ELSEIF v_dias_solicitados > v_dias_disponibles THEN
            SET p_resultado = FALSE;
            SET p_mensaje = CONCAT('No hay suficientes días disponibles. Solicitados: ', 
                                 v_dias_solicitados, '. Disponibles: ', v_dias_disponibles);
            ROLLBACK;
        ELSE
            -- Insertar la solicitud
            INSERT INTO vacaciones (
                id_empleado, fecha_inicio, fecha_fin, 
                dias_tomados, observaciones
            ) VALUES (
                p_id_empleado, p_fecha_inicio, p_fecha_fin,
                v_dias_solicitados, p_observaciones
            );
            
            SET p_id_vacacion = LAST_INSERT_ID();
            SET p_resultado = TRUE;
            SET p_mensaje = 'Vacaciones solicitadas exitosamente';
            COMMIT;
        END IF;
    END IF;
END //

-- -----------------------------------------------------------------


DELIMITER ;