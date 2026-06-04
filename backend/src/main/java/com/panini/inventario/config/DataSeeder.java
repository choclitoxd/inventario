package com.panini.inventario.config;

import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.model.Producto.Tipo;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.LoteInversionista.Financiador;
import com.panini.inventario.lote.model.LoteInversionista.Estado;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UsuarioRepository usuarioRepository;
        private final ClienteRepository clienteRepository;
        private final ProductoRepository productoRepository;
        private final LoteInversionistaRepository loteInversionistaRepository;
        private final InventarioRepository inventarioRepository;

        @Override
        public void run(String... args) throws Exception {
                // 1. Seed Users
                if (usuarioRepository.count() == 0) {
                        Usuario donato = Usuario.builder()
                                        .username("donato")
                                        .password("123456")
                                        .nombre("Donato")
                                        .rol("ADMIN")
                                        .build();

                        Usuario giank = Usuario.builder()
                                        .username("giank")
                                        .password("123456")
                                        .nombre("Giank")
                                        .rol("ADMIN")
                                        .build();

                        Usuario vector = Usuario.builder()
                                        .username("vector")
                                        .password("123456")
                                        .nombre("Vector")
                                        .rol("VENDEDOR")
                                        .build();

                        Usuario chefcito = Usuario.builder()
                                        .username("chefcito")
                                        .password("123456")
                                        .nombre("Chefcito")
                                        .rol("VENDEDOR")
                                        .build();

                        usuarioRepository.saveAll(List.of(donato, giank, vector, chefcito));
                        System.out.println(">>> Usuarios de prueba sembrados: donato, giank, vector, chefcito");
                }

                // 2. Seed Client
                Cliente testCliente = null;
                if (clienteRepository.count() == 0) {
                        testCliente = Cliente.builder()
                                        .nombre("Distribuidor Panini Bogotá")
                                        .telefono("3001234567")
                                        .build();
                        testCliente = clienteRepository.save(testCliente);
                        System.out.println(">>> Cliente de prueba sembrado: Distribuidor Panini Bogotá");
                }

                // 3. Seed Products
                Producto album = null;
                Producto cajaSobres = null;
                Producto sobreSuelto = null;
                if (productoRepository.count() == 0) {
                        album = Producto.builder()
                                        .nombre("Álbum Oficial Qatar 2022")
                                        .tipo(Tipo.ALBUM)
                                        .descripcion("Álbum de pasta blanda oficial de la Copa Mundial Qatar 2022")
                                        .precioSugeridoDefecto(new BigDecimal("10000"))
                                        .build();

                        cajaSobres = Producto.builder()
                                        .nombre("Caja de Sobres Qatar 2022")
                                        .tipo(Tipo.LAMINAS)
                                        .descripcion("Caja sellada que contiene 104 sobres de láminas oficiales")
                                        .precioSugeridoDefecto(new BigDecimal("350000"))
                                        .build();

                        sobreSuelto = Producto.builder()
                                        .nombre("Sobre de Láminas Qatar 2022")
                                        .tipo(Tipo.LAMINAS)
                                        .descripcion("Sobre individual con 5 láminas oficiales")
                                        .precioSugeridoDefecto(new BigDecimal("3500"))
                                        .build();

                        Producto savedAlbum = productoRepository.save(album);
                        Producto savedCajaSobres = productoRepository.save(cajaSobres);
                        Producto savedSobreSuelto = productoRepository.save(sobreSuelto);
                        album = savedAlbum;
                        cajaSobres = savedCajaSobres;
                        sobreSuelto = savedSobreSuelto;
                        System.out.println(">>> Catálogo de productos de prueba sembrado");
                } else {
                        // Load if already exists for inventory seeder
                        album = productoRepository.findAll().stream().filter(p -> p.getTipo() == Tipo.ALBUM).findFirst()
                                        .orElse(null);
                        cajaSobres = productoRepository.findAll().stream()
                                        .filter(p -> p.getTipo() == Tipo.LAMINAS && p.getNombre().contains("Caja"))
                                        .findFirst()
                                        .orElse(null);
                        sobreSuelto = productoRepository.findAll().stream()
                                        .filter(p -> p.getTipo() == Tipo.LAMINAS && p.getNombre().contains("Sobre"))
                                        .findFirst()
                                        .orElse(null);
                }

                // 4. Seed Lot / Financing
                LoteInversionista lote = null;
                if (loteInversionistaRepository.count() == 0) {
                        lote = LoteInversionista.builder()
                                        .nombreLote("Importación Inicial Inversionista Externo")
                                        .financiador(Financiador.INVERSIONISTA_EXTERNO)
                                        .nombreInversionista("Felipe Restrepo")
                                        .montoPrestado(new BigDecimal("5000000"))
                                        .saldoPendiente(new BigDecimal("5000000"))
                                        .porcentajeGananciaAmortizacion(new BigDecimal("50.00"))
                                        .estado(Estado.ACTIVO)
                                        .build();

                        lote = loteInversionistaRepository.save(lote);
                        System.out.println(">>> Lote de Inversionista Externo de prueba sembrado");
                } else {
                        lote = loteInversionistaRepository.findAll().stream().findFirst().orElse(null);
                }

                // 5. Seed Inventory stock
                if (inventarioRepository.count() == 0 && lote != null) {
                        if (album != null) {
                                Inventario invAlbum = Inventario.builder()
                                                .producto(album)
                                                .loteInversionista(lote)
                                                .cantInicialPacas(2) // 2 pacas = 52 álbumes
                                                .cantInicialCajas(0)
                                                .cantInicialUnidades(10) // 10 unidades sueltas
                                                .cantActualPacas(2)
                                                .cantActualCajas(0)
                                                .cantActualUnidades(10)
                                                .costoCompraPaca(new BigDecimal("182000")) // Costo de paca (26 álbumes)
                                                .costoCompraCaja(BigDecimal.ZERO)
                                                .costoCompraUnidad(new BigDecimal("7000")) // Costo por unidad suelta
                                                .build();
                                inventarioRepository.save(invAlbum);
                        }

                        if (cajaSobres != null) {
                                Inventario invCaja = Inventario.builder()
                                                .producto(cajaSobres)
                                                .loteInversionista(lote)
                                                .cantInicialPacas(1) // 1 paca = 10 cajas
                                                .cantInicialCajas(5) // 5 cajas sueltas
                                                .cantInicialUnidades(20) // 20 sobres sueltos
                                                .cantActualPacas(1)
                                                .cantActualCajas(5)
                                                .cantActualUnidades(20)
                                                .costoCompraPaca(new BigDecimal("2500000")) // Costo paca (10 cajas)
                                                .costoCompraCaja(new BigDecimal("260000")) // Costo por caja (104
                                                                                           // sobres)
                                                .costoCompraUnidad(new BigDecimal("2500")) // Costo por sobre
                                                .build();
                                inventarioRepository.save(invCaja);
                        }
                        System.out.println(">>> Niveles de inventario inicial sembrados");
                }
        }
}
