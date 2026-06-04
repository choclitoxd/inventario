-- =============================================================================
-- SISTEMA DE GESTIÓN DE INVENTARIO PANINI
-- SCRIPT DE BASE DE DATOS (MariaDB)
-- Tipo de Moneda: Pesos Colombianos (COP) - Representados como DECIMAL(15,2)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS panini_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE panini_db;

-- -----------------------------------------------------------------------------
-- 0. TABLA: negocios
-- Registro de los diferentes locales o sucursales del negocio.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS negocios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 1. TABLA: clientes
-- Registra clientes "al vuelo" con Nombre y Teléfono como identificador único.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    negocio_id INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE,
    INDEX idx_clientes_telefono (telefono),
    INDEX idx_clientes_negocio (negocio_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. TABLA: productos
-- Catálogo de productos. Los tipos pueden ser láminas/sobres, álbumes, combos o mercancía general.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo ENUM('LAMINAS', 'ALBUM', 'COMBO', 'OTRO') NOT NULL,
    descripcion TEXT,
    precio_sugerido_defecto DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Precio de venta recomendado por defecto en COP',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. TABLA: combos_composicion
-- Define la estructura / plantilla de los combos. Un combo se compone de otros productos.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS combos_composicion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    combo_id INT NOT NULL COMMENT 'ID del producto tipo COMBO',
    producto_componente_id INT NOT NULL COMMENT 'ID del producto componente (Laminas, Album, etc)',
    cantidad_pacas INT DEFAULT 0,
    cantidad_cajas INT DEFAULT 0,
    cantidad_unidades INT DEFAULT 0,
    FOREIGN KEY (combo_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_componente_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. TABLA: lotes_inversionistas
-- Registra el lote de compra y el origen de capital que lo financia.
-- Si es Inversionista Externo, funciona como préstamo con amortización de ganancias.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lotes_inversionistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_lote VARCHAR(150) NOT NULL COMMENT 'Ej: Lote Mundial 2026 - Inicial',
    financiador ENUM('DUENO_A', 'DUENO_B', 'INVERSIONISTA_EXTERNO') NOT NULL,
    nombre_inversionista VARCHAR(150) DEFAULT NULL COMMENT 'Nombre del prestamista si es INVERSIONISTA_EXTERNO',
    monto_prestado DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Monto total prestado en COP',
    saldo_pendiente DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Monto que falta pagar de la deuda',
    porcentaje_ganancia_amortizacion DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Porcentaje de la ganancia de la venta que va a amortizar (0.00% a 100.00%)',
    estado ENUM('ACTIVO', 'LIQUIDADO') DEFAULT 'ACTIVO',
    negocio_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE,
    INDEX idx_lotes_financiador (financiador),
    INDEX idx_lotes_negocio (negocio_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. TABLA: inventario
-- Control de stock físico real por lote (Dueño A, Dueño B, Inversionista Externo).
-- Permite guardar el stock físico real sin auto-desglose automático.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    lote_inversionista_id INT NOT NULL,
    
    -- Stock Inicial
    cant_inicial_pacas INT DEFAULT 0,
    cant_inicial_cajas INT DEFAULT 0 COMMENT 'Solo aplica para LAMINAS',
    cant_inicial_unidades INT DEFAULT 0 COMMENT 'Sobres (LAMINAS) o unidades de ALBUM/OTRO',
    
    -- Stock Actual
    cant_actual_pacas INT DEFAULT 0,
    cant_actual_cajas INT DEFAULT 0 COMMENT 'Solo aplica para LAMINAS',
    cant_actual_unidades INT DEFAULT 0 COMMENT 'Sobres (LAMINAS) o unidades de ALBUM/OTRO',
    
    -- Costo de Compra Unitario por nivel
    costo_compra_paca DECIMAL(15, 2) DEFAULT 0.00,
    costo_compra_caja DECIMAL(15, 2) DEFAULT 0.00,
    costo_compra_unidad DECIMAL(15, 2) DEFAULT 0.00,
    
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    FOREIGN KEY (lote_inversionista_id) REFERENCES lotes_inversionistas(id) ON DELETE RESTRICT,
    INDEX idx_inventario_producto (producto_id),
    INDEX idx_inventario_lote (lote_inversionista_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. TABLA: ventas
-- Encabezado de transacciones de contado (flujo de caja puro).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('EFECTIVO', 'TRANSFERENCIA') NOT NULL,
    total_venta DECIMAL(15, 2) NOT NULL,
    utilidad_bruta_total DECIMAL(15, 2) NOT NULL COMMENT 'Venta total - Costo total de mercancía vendida',
    negocio_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE,
    INDEX idx_ventas_fecha (fecha_venta),
    INDEX idx_ventas_negocio (negocio_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. TABLA: venta_detalles
-- Detalle de la venta. Permite registrar las ventas a nivel de Pacas, Cajas o Sobres/Unidades.
-- En caso de combos, se usa parent_detalle_id para relacionar sus componentes.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venta_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    inventario_id INT DEFAULT NULL COMMENT 'NULL para el item del COMBO contenedor; NOT NULL para items directos o componentes del combo',
    producto_id INT NOT NULL,
    parent_detalle_id INT DEFAULT NULL COMMENT 'Auto-referencia para combos. Apoya la desagregación de costos de los componentes',
    
    -- Cantidades vendidas
    cantidad_pacas INT DEFAULT 0,
    cantidad_cajas INT DEFAULT 0,
    cantidad_unidades INT DEFAULT 0,
    
    -- Precios de venta acordados (editables al momento de venta)
    precio_venta_paca DECIMAL(15, 2) DEFAULT 0.00,
    precio_venta_caja DECIMAL(15, 2) DEFAULT 0.00,
    precio_venta_unidad DECIMAL(15, 2) DEFAULT 0.00,
    
    subtotal DECIMAL(15, 2) NOT NULL COMMENT '(cant_pacas * precio_paca) + (cant_cajas * precio_caja) + (cant_unidades * precio_unidad)',
    costo_total DECIMAL(15, 2) NOT NULL COMMENT 'Costo de compra consolidado de los items vendidos (congelado de la tabla inventario)',
    utilidad_neta DECIMAL(15, 2) NOT NULL COMMENT 'subtotal - costo_total',
    monto_amortizado_inversionista DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Fracción de la utilidad que se destinó a pagar la deuda (si el lote era de Inversionista Externo)',
    
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE RESTRICT,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    FOREIGN KEY (parent_detalle_id) REFERENCES venta_detalles(id) ON DELETE CASCADE,
    INDEX idx_venta_detalles_inventario (inventario_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. TABLA: amortizaciones_deuda
-- Historial de pagos para saldar deudas de Inversionistas Externos.
-- Puede ser una amortización automática gatillada por una venta o un pago manual directo.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS amortizaciones_deuda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_inversionista_id INT NOT NULL,
    venta_detalle_id INT DEFAULT NULL COMMENT 'NULL si es pago manual directo; asociado si es amortización automática de una venta',
    monto_amortizado DECIMAL(15, 2) NOT NULL,
    fecha_amortizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('AUTOMATICA_VENTA', 'PAGO_MANUAL') NOT NULL,
    notas TEXT,
    FOREIGN KEY (lote_inversionista_id) REFERENCES lotes_inversionistas(id) ON DELETE RESTRICT,
    FOREIGN KEY (venta_detalle_id) REFERENCES venta_detalles(id) ON DELETE SET NULL,
    INDEX idx_amortizaciones_lote (lote_inversionista_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. TABLA: gastos_hormiga
-- Egresos cotidianos fletes, alimentación, transporte, etc.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gastos_hormiga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    fecha_gasto DATETIME DEFAULT CURRENT_TIMESTAMP,
    categoria ENUM('FLETE', 'TRANSPORTE', 'ALIMENTACION', 'OTRO') NOT NULL,
    lote_inversionista_id INT DEFAULT NULL COMMENT 'Opcional: Si se desea asignar el gasto hormiga a un lote/financiador específico',
    negocio_id INT NOT NULL,
    FOREIGN KEY (lote_inversionista_id) REFERENCES lotes_inversionistas(id) ON DELETE SET NULL,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE CASCADE,
    INDEX idx_gastos_fecha (fecha_gasto),
    INDEX idx_gastos_negocio (negocio_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. TABLA: registro_cajas_abiertas
-- Historial / Auditoría de la acción explícita "Abrir Caja".
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registro_cajas_abiertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT NOT NULL,
    cantidad_cajas INT DEFAULT 1 COMMENT 'Cantidad de cajas abiertas en este evento (habitualmente 1)',
    sobres_adicionados INT DEFAULT 104 COMMENT 'Sobres sumados al stock (habitualmente cajas * 104)',
    fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id) ON DELETE RESTRICT,
    INDEX idx_cajas_abiertas_fecha (fecha_apertura)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 11. TABLA: usuarios
-- Registro de usuarios de acceso al sistema con roles (ADMIN, JEFE, VENDEDOR).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) DEFAULT 'VENDEDOR'
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 12. TABLA: auditoria
-- Registro de acciones y auditoria general del sistema.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    detalle TEXT,
    negocio_id INT DEFAULT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (negocio_id) REFERENCES negocios(id) ON DELETE SET NULL,
    INDEX idx_auditoria_fecha (fecha),
    INDEX idx_auditoria_negocio (negocio_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- INSERT DE USUARIOS DE PRUEBA
-- -----------------------------------------------------------------------------
INSERT INTO usuarios (username, password, nombre, rol) VALUES
('donato', '123456', 'Donato', 'ADMIN'),
('giank', '123456', 'Giank', 'JEFE'),
('vector', '123456', 'Vector', 'VENDEDOR'),
('chefcito', '123456', 'Chefcito', 'VENDEDOR')
ON DUPLICATE KEY UPDATE rol=VALUES(rol);

