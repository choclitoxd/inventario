package com.panini.inventario.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DbHealthDto {
    private long latencyMs;
    private PoolStat pool;
    private List<TableStat> tables;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PoolStat {
        private int activeConnections;
        private int idleConnections;
        private int totalConnections;
        private int threadsAwaitingConnection;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TableStat {
        private String tableName;
        private long rowCount;
        private double dataSizeMb;
        private double indexSizeMb;
        private double totalSizeMb;
    }
}
