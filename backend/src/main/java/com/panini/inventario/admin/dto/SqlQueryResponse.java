package com.panini.inventario.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SqlQueryResponse {
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private int updateCount;
    private String message;
    private boolean error;
}
