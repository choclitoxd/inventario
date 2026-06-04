package com.panini.inventario.admin.service;

import com.panini.inventario.admin.dto.DbHealthDto;
import com.panini.inventario.admin.dto.SqlQueryResponse;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminDbService {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Obtiene el estado de salud, latencia y tamaño en disco de las tablas de la BD.
     */
    public DbHealthDto getDatabaseHealth() {
        long start = System.currentTimeMillis();
        // Ping rápido a la base de datos
        jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        long latencyMs = System.currentTimeMillis() - start;

        // Estadísticas del Connection Pool de Hikari
        DbHealthDto.PoolStat poolStat = DbHealthDto.PoolStat.builder()
                .activeConnections(0)
                .idleConnections(0)
                .totalConnections(0)
                .threadsAwaitingConnection(0)
                .build();

        if (dataSource instanceof HikariDataSource) {
            HikariDataSource hikariDS = (HikariDataSource) dataSource;
            if (hikariDS.getHikariPoolMXBean() != null) {
                poolStat = DbHealthDto.PoolStat.builder()
                        .activeConnections(hikariDS.getHikariPoolMXBean().getActiveConnections())
                        .idleConnections(hikariDS.getHikariPoolMXBean().getIdleConnections())
                        .totalConnections(hikariDS.getHikariPoolMXBean().getTotalConnections())
                        .threadsAwaitingConnection(hikariDS.getHikariPoolMXBean().getThreadsAwaitingConnection())
                        .build();
            }
        }

        // Estadísticas de las tablas
        List<DbHealthDto.TableStat> tables = new ArrayList<>();
        try {
            String sql = "SELECT " +
                    "    table_name AS tableName, " +
                    "    table_rows AS rowCount, " +
                    "    ROUND(((data_length) / 1024 / 1024), 4) AS dataSizeMb, " +
                    "    ROUND(((index_length) / 1024 / 1024), 4) AS indexSizeMb, " +
                    "    ROUND(((data_length + index_length) / 1024 / 1024), 4) AS totalSizeMb " +
                    "FROM information_schema.TABLES " +
                    "WHERE table_schema = DATABASE()";

            tables = jdbcTemplate.query(sql, (rs, rowNum) -> DbHealthDto.TableStat.builder()
                    .tableName(rs.getString("tableName"))
                    .rowCount(rs.getLong("rowCount"))
                    .dataSizeMb(rs.getDouble("dataSizeMb"))
                    .indexSizeMb(rs.getDouble("indexSizeMb"))
                    .totalSizeMb(rs.getDouble("totalSizeMb"))
                    .build());
        } catch (Exception e) {
            log.error("Error al obtener estadísticas de tablas de base de datos", e);
        }

        return DbHealthDto.builder()
                .latencyMs(latencyMs)
                .pool(poolStat)
                .tables(tables)
                .build();
    }

    /**
     * Ejecuta una consulta SQL del Playground y maneja el mapeo dinámico.
     */
    public SqlQueryResponse executeUserQuery(String rawQuery) {
        if (rawQuery == null || rawQuery.trim().isEmpty()) {
            return SqlQueryResponse.builder()
                    .error(true)
                    .message("La consulta SQL no puede estar vacía.")
                    .build();
        }

        String query = rawQuery.trim();
        String queryLower = query.toLowerCase();

        try {
            // Determinamos si es una consulta de lectura o de modificación
            boolean isSelect = queryLower.startsWith("select") ||
                    queryLower.startsWith("show") ||
                    queryLower.startsWith("explain") ||
                    queryLower.startsWith("describe");

            if (isSelect) {
                return jdbcTemplate.query(query, new ResultSetExtractor<SqlQueryResponse>() {
                    @Override
                    public SqlQueryResponse extractData(ResultSet rs) throws SQLException, DataAccessException {
                        ResultSetMetaData metaData = rs.getMetaData();
                        int columnCount = metaData.getColumnCount();
                        List<String> columns = new ArrayList<>();
                        for (int i = 1; i <= columnCount; i++) {
                            columns.add(metaData.getColumnLabel(i));
                        }

                        List<Map<String, Object>> rows = new ArrayList<>();
                        while (rs.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            for (int i = 1; i <= columnCount; i++) {
                                row.put(metaData.getColumnLabel(i), rs.getObject(i));
                            }
                            rows.add(row);
                        }

                        return SqlQueryResponse.builder()
                                .columns(columns)
                                .rows(rows)
                                .error(false)
                                .message("Consulta ejecutada con éxito. Registros devueltos: " + rows.size())
                                .build();
                    }
                });
            } else {
                int affectedRows = jdbcTemplate.update(query);
                return SqlQueryResponse.builder()
                        .updateCount(affectedRows)
                        .error(false)
                        .message("Sentencia ejecutada con éxito. Filas afectadas: " + affectedRows)
                        .build();
            }
        } catch (Exception e) {
            log.warn("Error al ejecutar consulta SQL en el Playground: {}", query, e);
            return SqlQueryResponse.builder()
                    .error(true)
                    .message("Error de base de datos: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Genera un script SQL completo con los datos de todas las tablas.
     */
    public String generateBackupSql() {
        StringBuilder backup = new StringBuilder();
        backup.append("-- -----------------------------------------------------\n");
        backup.append("-- RESPALDO DE BASE DE DATOS PANINI\n");
        backup.append("-- Generado el: ").append(new Date()).append("\n");
        backup.append("-- -----------------------------------------------------\n\n");

        backup.append("SET FOREIGN_KEY_CHECKS = 0;\n\n");

        // Listado de tablas en orden jerárquico aproximado
        List<String> tables = Arrays.asList(
                "negocios",
                "usuarios",
                "clientes",
                "productos",
                "combos_composicion",
                "lotes_inversionistas",
                "inventario",
                "ventas",
                "venta_detalles",
                "amortizaciones_deuda",
                "gastos_hormiga",
                "registro_cajas_abiertas",
                "auditoria"
        );

        for (String tableName : tables) {
            try {
                // Verificar si la tabla existe en la base de datos actual para evitar errores
                Integer tableExists = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
                        Integer.class,
                        tableName
                );

                if (tableExists == null || tableExists == 0) {
                    continue;
                }

                backup.append("-- -----------------------------------------------------\n");
                backup.append("-- Volcado de datos para la tabla: ").append(tableName).append("\n");
                backup.append("-- -----------------------------------------------------\n");
                backup.append("DELETE FROM `").append(tableName).append("`;\n");

                jdbcTemplate.query("SELECT * FROM `" + tableName + "`", (rs) -> {
                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    // Encabezado de columnas
                    StringBuilder colBuilder = new StringBuilder();
                    for (int i = 1; i <= columnCount; i++) {
                        if (i > 1) colBuilder.append(", ");
                        colBuilder.append("`").append(metaData.getColumnName(i)).append("`");
                    }

                    while (rs.next()) {
                        StringBuilder valBuilder = new StringBuilder();
                        for (int i = 1; i <= columnCount; i++) {
                            if (i > 1) valBuilder.append(", ");
                            Object val = rs.getObject(i);
                            if (val == null) {
                                valBuilder.append("NULL");
                            } else if (val instanceof Number) {
                                valBuilder.append(val);
                            } else if (val instanceof Boolean) {
                                valBuilder.append((Boolean) val ? 1 : 0);
                            } else {
                                String escaped = val.toString().replace("'", "''");
                                valBuilder.append("'").append(escaped).append("'");
                            }
                        }
                        backup.append("INSERT INTO `").append(tableName).append("` (")
                                .append(colBuilder).append(") VALUES (").append(valBuilder).append(");\n");
                    }
                    return null;
                });
                backup.append("\n");
            } catch (Exception e) {
                log.error("Error al exportar tabla {}", tableName, e);
                backup.append("-- ERROR al exportar la tabla ").append(tableName).append(": ").append(e.getMessage()).append("\n\n");
            }
        }

        backup.append("SET FOREIGN_KEY_CHECKS = 1;\n");
        return backup.toString();
    }

    /**
     * Restaura la base de datos a partir de un archivo SQL subido.
     */
    @Transactional
    public void restoreDatabase(InputStream inputStream) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            StringBuilder statement = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmedLine = line.trim();
                // Ignorar comentarios o líneas vacías
                if (trimmedLine.isEmpty() || trimmedLine.startsWith("--") || trimmedLine.startsWith("/*")) {
                    continue;
                }

                statement.append(line).append("\n");

                // Si la línea termina con ';', es una sentencia completa lista para ejecutar
                if (trimmedLine.endsWith(";")) {
                    String sql = statement.toString().trim();
                    try {
                        jdbcTemplate.execute(sql);
                    } catch (DataAccessException e) {
                        log.error("Error al ejecutar sentencia SQL durante la restauración: {}", sql, e);
                        throw new RuntimeException("Fallo en la línea SQL: " + sql + ". Causa: " + e.getMessage(), e);
                    }
                    statement.setLength(0); // Limpiar para la siguiente
                }
            }
        }
    }
}
