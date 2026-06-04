package com.panini.inventario.admin.controller;

import com.panini.inventario.admin.dto.DbHealthDto;
import com.panini.inventario.admin.dto.SqlQueryRequest;
import com.panini.inventario.admin.dto.SqlQueryResponse;
import com.panini.inventario.admin.service.AdminDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/db")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AdminDbController {

    private final AdminDbService adminDbService;

    @GetMapping("/health")
    public ResponseEntity<DbHealthDto> getDbHealth() {
        return ResponseEntity.ok(adminDbService.getDatabaseHealth());
    }

    @PostMapping("/query")
    public ResponseEntity<SqlQueryResponse> executeQuery(@RequestBody SqlQueryRequest request) {
        SqlQueryResponse response = adminDbService.executeUserQuery(request.getQuery());
        if (response.isError()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backup")
    public ResponseEntity<byte[]> downloadBackup() {
        try {
            String sqlContent = adminDbService.generateBackupSql();
            byte[] backupBytes = sqlContent.getBytes("UTF-8");

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String fileName = "backup_panini_" + timestamp + ".sql";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(backupBytes.length)
                    .body(backupBytes);
        } catch (Exception e) {
            log.error("Error al generar descarga de respaldo SQL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/restore")
    public ResponseEntity<Map<String, String>> restoreDatabase(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El archivo de respaldo está vacío."));
        }

        try {
            adminDbService.restoreDatabase(file.getInputStream());
            return ResponseEntity.ok(Map.of("message", "Base de datos restaurada con éxito."));
        } catch (Exception e) {
            log.error("Error al restaurar base de datos desde archivo subido", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error durante la restauración: " + e.getMessage()));
        }
    }
}
