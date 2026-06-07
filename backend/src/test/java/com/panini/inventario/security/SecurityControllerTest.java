package com.panini.inventario.security;

import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    public void autoEliminarUsuario_DebeRetornarBadRequest() throws Exception {
        Usuario testAdmin = usuarioRepository.findByUsername("test_admin_delete").orElseGet(() -> {
            Usuario u = Usuario.builder()
                    .username("test_admin_delete")
                    .password("123456")
                    .nombre("Test Admin Delete")
                    .rol("ADMIN")
                    .build();
            return usuarioRepository.save(u);
        });

        mockMvc.perform(delete("/api/usuarios/" + testAdmin.getId())
                .header("X-User-Username", "test_admin_delete"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void accederReportesComoOrganizador_DebeRetornarForbidden() throws Exception {
        Usuario testOrg = usuarioRepository.findByUsername("test_org_reports").orElseGet(() -> {
            Usuario u = Usuario.builder()
                    .username("test_org_reports")
                    .password("123456")
                    .nombre("Test Org Reports")
                    .rol("ORGANIZADOR")
                    .build();
            return usuarioRepository.save(u);
        });

        mockMvc.perform(get("/api/reportes/resumen")
                .header("X-User-Username", "test_org_reports"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void crudSedeInventarioComoOrganizador_DebeRetornarForbidden() throws Exception {
        Usuario testOrg = usuarioRepository.findByUsername("test_org_sede_inv").orElseGet(() -> {
            Usuario u = Usuario.builder()
                    .username("test_org_sede_inv")
                    .password("123456")
                    .nombre("Test Org Sede Inv")
                    .rol("ORGANIZADOR")
                    .build();
            return usuarioRepository.save(u);
        });

        // 1. POST /api/sedes/inventario
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/sedes/inventario")
                .header("X-User-Username", "test_org_sede_inv")
                .header("X-Negocio-Id", "1")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());

        // 2. PUT /api/sedes/inventario/1
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/sedes/inventario/1")
                .header("X-User-Username", "test_org_sede_inv")
                .header("X-Negocio-Id", "1")
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());

        // 3. DELETE /api/sedes/inventario/1
        mockMvc.perform(delete("/api/sedes/inventario/1")
                .header("X-User-Username", "test_org_sede_inv")
                .header("X-Negocio-Id", "1"))
                .andExpect(status().isForbidden());
    }
}
