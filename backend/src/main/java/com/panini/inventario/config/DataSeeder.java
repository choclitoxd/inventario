package com.panini.inventario.config;

import com.panini.inventario.negocio.model.Negocio;
import com.panini.inventario.negocio.repository.NegocioRepository;
import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import com.panini.inventario.cliente.model.Cliente;
import com.panini.inventario.cliente.repository.ClienteRepository;
import com.panini.inventario.producto.model.Producto;
import com.panini.inventario.producto.model.Producto.Tipo;
import com.panini.inventario.producto.repository.ProductoRepository;
import com.panini.inventario.producto.model.ComboComposicion;
import com.panini.inventario.producto.repository.ComboComposicionRepository;
import com.panini.inventario.lote.model.LoteInversionista;
import com.panini.inventario.lote.model.LoteInversionista.Financiador;
import com.panini.inventario.lote.model.LoteInversionista.Estado;
import com.panini.inventario.lote.repository.LoteInversionistaRepository;
import com.panini.inventario.stock.model.Inventario;
import com.panini.inventario.stock.repository.InventarioRepository;
import com.panini.inventario.stock.model.RegistroCajaAbierta;
import com.panini.inventario.stock.repository.RegistroCajaAbiertaRepository;
import com.panini.inventario.venta.model.Venta;
import com.panini.inventario.venta.model.Venta.MetodoPago;
import com.panini.inventario.venta.repository.VentaRepository;
import com.panini.inventario.venta.model.VentaDetalle;
import com.panini.inventario.venta.repository.VentaDetalleRepository;
import com.panini.inventario.lote.model.AmortizacionDeuda;
import com.panini.inventario.lote.model.AmortizacionDeuda.TipoAmortizacion;
import com.panini.inventario.lote.repository.AmortizacionDeudaRepository;
import com.panini.inventario.gasto.model.GastoHormiga;
import com.panini.inventario.gasto.model.GastoHormiga.CategoriaGasto;
import com.panini.inventario.gasto.repository.GastoHormigaRepository;
import com.panini.inventario.auditoria.model.Auditoria;
import com.panini.inventario.auditoria.repository.AuditoriaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final NegocioRepository negocioRepository;
        private final UsuarioRepository usuarioRepository;
        private final ClienteRepository clienteRepository;
        private final ProductoRepository productoRepository;
        private final ComboComposicionRepository comboComposicionRepository;
        private final LoteInversionistaRepository loteInversionistaRepository;
        private final InventarioRepository inventarioRepository;
        private final VentaRepository ventaRepository;
        private final VentaDetalleRepository ventaDetalleRepository;
        private final AmortizacionDeudaRepository amortizacionDeudaRepository;
        private final GastoHormigaRepository gastoHormigaRepository;
        private final RegistroCajaAbiertaRepository registroCajaAbiertaRepository;
        private final AuditoriaRepository auditoriaRepository;
        private final JdbcTemplate jdbcTemplate;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                System.out.println(">>> Iniciando proceso de limpieza y sembrado de base de datos...");

                // 1. Limpieza de tablas en orden seguro de dependencias
                try {
                        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");
                        jdbcTemplate.execute("TRUNCATE TABLE auditoria;");
                        jdbcTemplate.execute("TRUNCATE TABLE registro_cajas_abiertas;");
                        jdbcTemplate.execute("TRUNCATE TABLE amortizaciones_deuda;");
                        jdbcTemplate.execute("TRUNCATE TABLE venta_detalles;");
                        jdbcTemplate.execute("TRUNCATE TABLE ventas;");
                        jdbcTemplate.execute("TRUNCATE TABLE gastos_hormiga;");
                        jdbcTemplate.execute("TRUNCATE TABLE inventario;");
                        jdbcTemplate.execute("TRUNCATE TABLE lotes_proveedores;");
                        jdbcTemplate.execute("TRUNCATE TABLE proveedores;");
                        jdbcTemplate.execute("TRUNCATE TABLE proveedores_tarifas;");
                        jdbcTemplate.execute("TRUNCATE TABLE combos_composicion;");
                        jdbcTemplate.execute("TRUNCATE TABLE clientes;");
                        jdbcTemplate.execute("TRUNCATE TABLE usuarios;");
                        jdbcTemplate.execute("TRUNCATE TABLE negocios;");
                        jdbcTemplate.execute("TRUNCATE TABLE productos;");
                        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");
                        System.out.println(">>> Base de datos limpia: Todas las tablas truncadas con éxito.");
                } catch (Exception e) {
                        System.err.println(">>> Error al limpiar la base de datos: " + e.getMessage());
                        try {
                                jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");
                        } catch (Exception ignored) {}
                }

                // 2. Sembrar Negocios (Sedes)
                Negocio bogota = Negocio.builder()
                                .nombre("Panini Bogotá")
                                .duenos("Donato, Giank")
                                .build();

                Negocio medellin = Negocio.builder()
                                .nombre("Panini Medellín")
                                .duenos("Donato")
                                .build();

                bogota = negocioRepository.save(bogota);
                medellin = negocioRepository.save(medellin);
                System.out.println(">>> Sedes sembradas: Panini Bogotá, Panini Medellín");

                // 3. Sembrar Usuarios
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
                                .rol("DUENO")
                                .build();

                Usuario vector = Usuario.builder()
                                .username("vector")
                                .password("123456")
                                .nombre("Vector")
                                .rol("ORGANIZADOR")
                                .build();

                Usuario chefcito = Usuario.builder()
                                .username("chefcito")
                                .password("123456")
                                .nombre("Chefcito")
                                .rol("ORGANIZADOR")
                                .build();

                usuarioRepository.saveAll(List.of(donato, giank, vector, chefcito));
                System.out.println(">>> Usuarios sembrados: donato (ADMIN), giank (DUENO), vector (ORGANIZADOR), chefcito (ORGANIZADOR)");

                // 4. Sembrar Clientes
                Cliente clienteBog1 = Cliente.builder()
                                .nombre("Distribuidor Mayorista Bogotá")
                                .telefono("3001234567")
                                .negocio(bogota)
                                .build();

                Cliente clienteBog2 = Cliente.builder()
                                .nombre("Kiosko Parque Bogotá")
                                .telefono("3109876543")
                                .negocio(bogota)
                                .build();

                Cliente clienteMed1 = Cliente.builder()
                                .nombre("Coleccionista Premium Medellín")
                                .telefono("3154445555")
                                .negocio(medellin)
                                .build();

                Cliente clienteMed2 = Cliente.builder()
                                .nombre("Tienda Medellín Centro")
                                .telefono("3206667777")
                                .negocio(medellin)
                                .build();

                clienteRepository.saveAll(List.of(clienteBog1, clienteBog2, clienteMed1, clienteMed2));
                System.out.println(">>> Clientes sembrados para ambas sedes");

                // 5. Sembrar Productos
                Producto album = Producto.builder()
                                .nombre("Álbum Oficial Qatar 2022")
                                .tipo(Tipo.FRACCIONADO_ALBUMES)
                                .factorConversion(26) // 1 paca = 26 álbumes
                                .descripcion("Álbum de pasta blanda oficial de la Copa Mundial Qatar 2022")
                                .precioSugeridoDefecto(new BigDecimal("10000"))
                                .build();

                Producto cajaSobres = Producto.builder()
                                .nombre("Caja de Sobres Qatar 2022")
                                .tipo(Tipo.FRACCIONADO_LAMINAS)
                                .factorConversion(10) // 1 paca = 10 cajas
                                .descripcion("Caja sellada que contiene 104 sobres de láminas oficiales")
                                .precioSugeridoDefecto(new BigDecimal("350000"))
                                .build();

                Producto sobreSuelto = Producto.builder()
                                .nombre("Sobre de Láminas Qatar 2022")
                                .tipo(Tipo.UNIDAD_SIMPLE)
                                .descripcion("Sobre individual con 5 láminas oficiales")
                                .precioSugeridoDefecto(new BigDecimal("3500"))
                                .build();

                Producto combo = Producto.builder()
                                .nombre("Combo Álbum + Caja Qatar")
                                .tipo(Tipo.UNIDAD_SIMPLE)
                                .descripcion("Combo especial: 1 Álbum Oficial + 1 Caja de Sobres Qatar 2022")
                                .precioSugeridoDefecto(new BigDecimal("330000"))
                                .build();

                album = productoRepository.save(album);
                cajaSobres = productoRepository.save(cajaSobres);
                sobreSuelto = productoRepository.save(sobreSuelto);
                combo = productoRepository.save(combo);

                // Configurar la composición del combo
                ComboComposicion comp1 = ComboComposicion.builder()
                                .combo(combo)
                                .productoComponente(album)
                                .cantidadPacas(0)
                                .cantidadCajas(0)
                                .cantidadUnidades(1)
                                .build();

                ComboComposicion comp2 = ComboComposicion.builder()
                                .combo(combo)
                                .productoComponente(cajaSobres)
                                .cantidadPacas(0)
                                .cantidadCajas(1)
                                .cantidadUnidades(0)
                                .build();

                comboComposicionRepository.saveAll(List.of(comp1, comp2));
                System.out.println(">>> Productos y Composición de Combo sembrados");

                // 6. Sembrar Lotes de Inversionistas
                // Bogotá Lots
                LoteInversionista loteBogA = LoteInversionista.builder()
                                .nombreLote("Lote Inversión A Bogotá")
                                .financiador(Financiador.DUENO_A)
                                .montoPrestado(new BigDecimal("10000000"))
                                .saldoPendiente(BigDecimal.ZERO)
                                .porcentajeGananciaAmortizacion(BigDecimal.ZERO)
                                .estado(Estado.ACTIVO)
                                .negocio(bogota)
                                .build();

                LoteInversionista loteBogB = LoteInversionista.builder()
                                .nombreLote("Lote Inversión B Bogotá")
                                .financiador(Financiador.DUENO_B)
                                .montoPrestado(new BigDecimal("8000000"))
                                .saldoPendiente(BigDecimal.ZERO)
                                .porcentajeGananciaAmortizacion(BigDecimal.ZERO)
                                .estado(Estado.ACTIVO)
                                .negocio(bogota)
                                .build();

                LoteInversionista loteBogExt = LoteInversionista.builder()
                                .nombreLote("Lote Externo Felipe Restrepo")
                                .financiador(Financiador.INVERSIONISTA_EXTERNO)
                                .nombreInversionista("Felipe Restrepo")
                                .montoPrestado(new BigDecimal("5000000"))
                                .saldoPendiente(new BigDecimal("3500000"))
                                .porcentajeGananciaAmortizacion(new BigDecimal("50.00"))
                                .estado(Estado.ACTIVO)
                                .negocio(bogota)
                                .build();

                // Medellín Lots
                LoteInversionista loteMedA = LoteInversionista.builder()
                                .nombreLote("Lote Dueño A Medellín")
                                .financiador(Financiador.DUENO_A)
                                .montoPrestado(new BigDecimal("6000000"))
                                .saldoPendiente(BigDecimal.ZERO)
                                .porcentajeGananciaAmortizacion(BigDecimal.ZERO)
                                .estado(Estado.ACTIVO)
                                .negocio(medellin)
                                .build();

                LoteInversionista loteMedExt = LoteInversionista.builder()
                                .nombreLote("Lote Externo Medellín")
                                .financiador(Financiador.INVERSIONISTA_EXTERNO)
                                .nombreInversionista("Andrés Gómez")
                                .montoPrestado(new BigDecimal("8000000"))
                                .saldoPendiente(new BigDecimal("8000000"))
                                .porcentajeGananciaAmortizacion(new BigDecimal("40.00"))
                                .estado(Estado.ACTIVO)
                                .negocio(medellin)
                                .build();

                loteBogA = loteInversionistaRepository.save(loteBogA);
                loteBogB = loteInversionistaRepository.save(loteBogB);
                loteBogExt = loteInversionistaRepository.save(loteBogExt);
                loteMedA = loteInversionistaRepository.save(loteMedA);
                loteMedExt = loteInversionistaRepository.save(loteMedExt);
                System.out.println(">>> Lotes de capital/inversionistas sembrados");

                // 7. Sembrar Inventario (Stock de productos vinculados a Lotes)
                // Bogotá Stock
                Inventario stockBogA_album = Inventario.builder()
                                .producto(album)
                                .loteInversionista(loteBogA)
                                .cantInicialPacas(5)
                                .cantInicialCajas(0)
                                .cantInicialUnidades(15)
                                .cantActualPacas(4)
                                .cantActualCajas(0)
                                .cantActualUnidades(10)
                                .costoCompraPaca(new BigDecimal("182000"))
                                .costoCompraCaja(BigDecimal.ZERO)
                                .costoCompraUnidad(new BigDecimal("7000"))
                                .build();

                Inventario stockBogA_caja = Inventario.builder()
                                .producto(cajaSobres)
                                .loteInversionista(loteBogA)
                                .cantInicialPacas(3)
                                .cantInicialCajas(4)
                                .cantInicialUnidades(50)
                                .cantActualPacas(2)
                                .cantActualCajas(2)
                                .cantActualUnidades(30)
                                .costoCompraPaca(new BigDecimal("2500000"))
                                .costoCompraCaja(new BigDecimal("260000"))
                                .costoCompraUnidad(new BigDecimal("2500"))
                                .build();

                Inventario stockBogB_album = Inventario.builder()
                                .producto(album)
                                .loteInversionista(loteBogB)
                                .cantInicialPacas(2)
                                .cantInicialCajas(0)
                                .cantInicialUnidades(5)
                                .cantActualPacas(2)
                                .cantActualCajas(0)
                                .cantActualUnidades(5)
                                .costoCompraPaca(new BigDecimal("182000"))
                                .costoCompraCaja(BigDecimal.ZERO)
                                .costoCompraUnidad(new BigDecimal("7000"))
                                .build();

                Inventario stockBogB_caja = Inventario.builder()
                                .producto(cajaSobres)
                                .loteInversionista(loteBogB)
                                .cantInicialPacas(1)
                                .cantInicialCajas(8)
                                .cantInicialUnidades(20)
                                .cantActualPacas(1)
                                .cantActualCajas(7)
                                .cantActualUnidades(15)
                                .costoCompraPaca(new BigDecimal("2500000"))
                                .costoCompraCaja(new BigDecimal("260000"))
                                .costoCompraUnidad(new BigDecimal("2500"))
                                .build();

                Inventario stockBogExt_album = Inventario.builder()
                                .producto(album)
                                .loteInversionista(loteBogExt)
                                .cantInicialPacas(3)
                                .cantInicialCajas(0)
                                .cantInicialUnidades(10)
                                .cantActualPacas(2)
                                .cantActualCajas(0)
                                .cantActualUnidades(4)
                                .costoCompraPaca(new BigDecimal("182000"))
                                .costoCompraCaja(BigDecimal.ZERO)
                                .costoCompraUnidad(new BigDecimal("7000"))
                                .build();

                Inventario stockBogExt_caja = Inventario.builder()
                                .producto(cajaSobres)
                                .loteInversionista(loteBogExt)
                                .cantInicialPacas(2)
                                .cantInicialCajas(5)
                                .cantInicialUnidades(30)
                                .cantActualPacas(1)
                                .cantActualCajas(3)
                                .cantActualUnidades(20)
                                .costoCompraPaca(new BigDecimal("2500000"))
                                .costoCompraCaja(new BigDecimal("260000"))
                                .costoCompraUnidad(new BigDecimal("2500"))
                                .build();

                // Medellín Stock
                Inventario stockMedA_album = Inventario.builder()
                                .producto(album)
                                .loteInversionista(loteMedA)
                                .cantInicialPacas(4)
                                .cantInicialCajas(0)
                                .cantInicialUnidades(20)
                                .cantActualPacas(4)
                                .cantActualCajas(0)
                                .cantActualUnidades(20)
                                .costoCompraPaca(new BigDecimal("182000"))
                                .costoCompraCaja(BigDecimal.ZERO)
                                .costoCompraUnidad(new BigDecimal("7000"))
                                .build();

                Inventario stockMedA_caja = Inventario.builder()
                                .producto(cajaSobres)
                                .loteInversionista(loteMedA)
                                .cantInicialPacas(2)
                                .cantInicialCajas(3)
                                .cantInicialUnidades(40)
                                .cantActualPacas(2)
                                .cantActualCajas(3)
                                .cantActualUnidades(40)
                                .costoCompraPaca(new BigDecimal("2500000"))
                                .costoCompraCaja(new BigDecimal("260000"))
                                .costoCompraUnidad(new BigDecimal("2500"))
                                .build();

                Inventario stockMedExt_album = Inventario.builder()
                                .producto(album)
                                .loteInversionista(loteMedExt)
                                .cantInicialPacas(2)
                                .cantInicialCajas(0)
                                .cantInicialUnidades(8)
                                .cantActualPacas(1)
                                .cantActualCajas(0)
                                .cantActualUnidades(5)
                                .costoCompraPaca(new BigDecimal("182000"))
                                .costoCompraCaja(BigDecimal.ZERO)
                                .costoCompraUnidad(new BigDecimal("7000"))
                                .build();

                Inventario stockMedExt_caja = Inventario.builder()
                                .producto(cajaSobres)
                                .loteInversionista(loteMedExt)
                                .cantInicialPacas(1)
                                .cantInicialCajas(5)
                                .cantInicialUnidades(15)
                                .cantActualPacas(1)
                                .cantActualCajas(4)
                                .cantActualUnidades(10)
                                .costoCompraPaca(new BigDecimal("2500000"))
                                .costoCompraCaja(new BigDecimal("260000"))
                                .costoCompraUnidad(new BigDecimal("2500"))
                                .build();

                stockBogA_album = inventarioRepository.save(stockBogA_album);
                stockBogA_caja = inventarioRepository.save(stockBogA_caja);
                stockBogB_album = inventarioRepository.save(stockBogB_album);
                stockBogB_caja = inventarioRepository.save(stockBogB_caja);
                stockBogExt_album = inventarioRepository.save(stockBogExt_album);
                stockBogExt_caja = inventarioRepository.save(stockBogExt_caja);
                stockMedA_album = inventarioRepository.save(stockMedA_album);
                stockMedA_caja = inventarioRepository.save(stockMedA_caja);
                stockMedExt_album = inventarioRepository.save(stockMedExt_album);
                stockMedExt_caja = inventarioRepository.save(stockMedExt_caja);
                System.out.println(">>> Niveles de inventario sembrados para cada lote");

                // 8. Sembrar Ventas Históricas y Detalles (Últimos 30 días)
                // Venta 1: Bogotá (Hace 15 días) - 1 Paca de álbumes de Lote A
                Venta venta1 = Venta.builder()
                                .cliente(clienteBog1)
                                .fechaVenta(LocalDateTime.now().minusDays(15))
                                .metodoPago(MetodoPago.EFECTIVO)
                                .totalVenta(new BigDecimal("250000"))
                                .utilidadBrutaTotal(new BigDecimal("68000")) // $250,000 - $182,000
                                .negocio(bogota)
                                .build();
                venta1 = ventaRepository.save(venta1);

                VentaDetalle det1 = VentaDetalle.builder()
                                .venta(venta1)
                                .inventario(stockBogA_album)
                                .producto(album)
                                .cantidadPacas(1)
                                .cantidadCajas(0)
                                .cantidadUnidades(0)
                                .precioVentaPaca(new BigDecimal("250000"))
                                .precioVentaCaja(BigDecimal.ZERO)
                                .precioVentaUnidad(BigDecimal.ZERO)
                                .subtotal(new BigDecimal("250000"))
                                .costoTotal(new BigDecimal("182000"))
                                .utilidadNeta(new BigDecimal("68000"))
                                .montoAmortizadoInversionista(BigDecimal.ZERO)
                                .build();
                ventaDetalleRepository.save(det1);

                // Venta 2: Bogotá (Hace 10 días) - 2 Cajas de sobres de Lote Externo (genera Amortización de 50%)
                Venta venta2 = Venta.builder()
                                .cliente(clienteBog2)
                                .fechaVenta(LocalDateTime.now().minusDays(10))
                                .metodoPago(MetodoPago.TRANSFERENCIA)
                                .totalVenta(new BigDecimal("680000"))
                                .utilidadBrutaTotal(new BigDecimal("160000")) // $680,000 - $520,000
                                .negocio(bogota)
                                .build();
                venta2 = ventaRepository.save(venta2);

                VentaDetalle det2 = VentaDetalle.builder()
                                .venta(venta2)
                                .inventario(stockBogExt_caja)
                                .producto(cajaSobres)
                                .cantidadPacas(0)
                                .cantidadCajas(2)
                                .cantidadUnidades(0)
                                .precioVentaPaca(BigDecimal.ZERO)
                                .precioVentaCaja(new BigDecimal("340000"))
                                .precioVentaUnidad(BigDecimal.ZERO)
                                .subtotal(new BigDecimal("680000"))
                                .costoTotal(new BigDecimal("520000"))
                                .utilidadNeta(new BigDecimal("160000"))
                                .montoAmortizadoInversionista(new BigDecimal("80000"))
                                .build();
                det2 = ventaDetalleRepository.save(det2);

                // Registrar Amortización Automática de Deuda para Lote Externo
                AmortizacionDeuda amortAuto1 = AmortizacionDeuda.builder()
                                .loteInversionista(loteBogExt)
                                .ventaDetalle(det2)
                                .montoAmortizado(new BigDecimal("80000"))
                                .fechaAmortizacion(LocalDateTime.now().minusDays(10))
                                .tipo(TipoAmortizacion.AUTOMATICA_VENTA)
                                .notas("Amortización automática extraída de la venta #" + venta2.getId())
                                .build();
                amortizacionDeudaRepository.save(amortAuto1);

                // Venta 3: Bogotá (Hace 5 días) - Combo Álbum + Caja (Lote B)
                Venta venta3 = Venta.builder()
                                .cliente(clienteBog1)
                                .fechaVenta(LocalDateTime.now().minusDays(5))
                                .metodoPago(MetodoPago.EFECTIVO)
                                .totalVenta(new BigDecimal("330000"))
                                .utilidadBrutaTotal(new BigDecimal("63000")) // $330,000 - ($7,000 + $260,000)
                                .negocio(bogota)
                                .build();
                venta3 = ventaRepository.save(venta3);

                // Detalle Padre (Combo)
                VentaDetalle det3ComboPadre = VentaDetalle.builder()
                                .venta(venta3)
                                .producto(combo)
                                .cantidadPacas(0)
                                .cantidadCajas(0)
                                .cantidadUnidades(1)
                                .precioVentaPaca(BigDecimal.ZERO)
                                .precioVentaCaja(BigDecimal.ZERO)
                                .precioVentaUnidad(new BigDecimal("330000"))
                                .subtotal(new BigDecimal("330000"))
                                .costoTotal(BigDecimal.ZERO)
                                .utilidadNeta(new BigDecimal("330000"))
                                .montoAmortizadoInversionista(BigDecimal.ZERO)
                                .build();
                det3ComboPadre = ventaDetalleRepository.save(det3ComboPadre);

                // Detalle Hijo 1 (Álbum)
                VentaDetalle det3Hijo1 = VentaDetalle.builder()
                                .venta(venta3)
                                .inventario(stockBogB_album)
                                .producto(album)
                                .parentDetalle(det3ComboPadre)
                                .cantidadPacas(0)
                                .cantidadCajas(0)
                                .cantidadUnidades(1)
                                .precioVentaPaca(BigDecimal.ZERO)
                                .precioVentaCaja(BigDecimal.ZERO)
                                .precioVentaUnidad(BigDecimal.ZERO)
                                .subtotal(BigDecimal.ZERO)
                                .costoTotal(new BigDecimal("7000"))
                                .utilidadNeta(new BigDecimal("-7000"))
                                .montoAmortizadoInversionista(BigDecimal.ZERO)
                                .build();
                ventaDetalleRepository.save(det3Hijo1);

                // Detalle Hijo 2 (Caja)
                VentaDetalle det3Hijo2 = VentaDetalle.builder()
                                .venta(venta3)
                                .inventario(stockBogB_caja)
                                .producto(cajaSobres)
                                .parentDetalle(det3ComboPadre)
                                .cantidadPacas(0)
                                .cantidadCajas(1)
                                .cantidadUnidades(0)
                                .precioVentaPaca(BigDecimal.ZERO)
                                .precioVentaCaja(BigDecimal.ZERO)
                                .precioVentaUnidad(BigDecimal.ZERO)
                                .subtotal(BigDecimal.ZERO)
                                .costoTotal(new BigDecimal("260000"))
                                .utilidadNeta(new BigDecimal("-260000"))
                                .montoAmortizadoInversionista(BigDecimal.ZERO)
                                .build();
                ventaDetalleRepository.save(det3Hijo2);

                // Venta 4: Medellín (Hace 3 días) - 1 Paca y 3 Álbumes de Lote Externo Medellín (Amortización 40%)
                Venta venta4 = Venta.builder()
                                .cliente(clienteMed1)
                                .fechaVenta(LocalDateTime.now().minusDays(3))
                                .metodoPago(MetodoPago.TRANSFERENCIA)
                                .totalVenta(new BigDecimal("290000"))
                                .utilidadBrutaTotal(new BigDecimal("87000")) // $290,000 - $203,000
                                .negocio(medellin)
                                .build();
                venta4 = ventaRepository.save(venta4);

                VentaDetalle det4 = VentaDetalle.builder()
                                .venta(venta4)
                                .inventario(stockMedExt_album)
                                .producto(album)
                                .cantidadPacas(1)
                                .cantidadCajas(0)
                                .cantidadUnidades(3)
                                .precioVentaPaca(new BigDecimal("260000"))
                                .precioVentaCaja(BigDecimal.ZERO)
                                .precioVentaUnidad(new BigDecimal("10000"))
                                .subtotal(new BigDecimal("290000"))
                                .costoTotal(new BigDecimal("203000"))
                                .utilidadNeta(new BigDecimal("87000"))
                                .montoAmortizadoInversionista(new BigDecimal("34800"))
                                .build();
                det4 = ventaDetalleRepository.save(det4);

                // Registrar Amortización Automática Medellín
                AmortizacionDeuda amortAuto2 = AmortizacionDeuda.builder()
                                .loteInversionista(loteMedExt)
                                .ventaDetalle(det4)
                                .montoAmortizado(new BigDecimal("34800"))
                                .fechaAmortizacion(LocalDateTime.now().minusDays(3))
                                .tipo(TipoAmortizacion.AUTOMATICA_VENTA)
                                .notas("Amortización automática extraída de la venta #" + venta4.getId())
                                .build();
                amortizacionDeudaRepository.save(amortAuto2);

                // Venta 5: Medellín (Ayer) - 1 Caja de sobres de Lote A Medellín
                Venta venta5 = Venta.builder()
                                .cliente(clienteMed2)
                                .fechaVenta(LocalDateTime.now().minusDays(1))
                                .metodoPago(MetodoPago.EFECTIVO)
                                .totalVenta(new BigDecimal("350000"))
                                .utilidadBrutaTotal(new BigDecimal("90000")) // $350,000 - $260,000
                                .negocio(medellin)
                                .build();
                venta5 = ventaRepository.save(venta5);

                VentaDetalle det5 = VentaDetalle.builder()
                                .venta(venta5)
                                .inventario(stockMedA_caja)
                                .producto(cajaSobres)
                                .cantidadPacas(0)
                                .cantidadCajas(1)
                                .cantidadUnidades(0)
                                .precioVentaPaca(BigDecimal.ZERO)
                                .precioVentaCaja(new BigDecimal("350000"))
                                .precioVentaUnidad(BigDecimal.ZERO)
                                .subtotal(new BigDecimal("350000"))
                                .costoTotal(new BigDecimal("260000"))
                                .utilidadNeta(new BigDecimal("90000"))
                                .montoAmortizadoInversionista(BigDecimal.ZERO)
                                .build();
                ventaDetalleRepository.save(det5);

                System.out.println(">>> Historial de ventas sembrado");

                // 9. Sembrar Amortizaciones Manuales (Abonos Directos a Deuda)
                AmortizacionDeuda amortManual1 = AmortizacionDeuda.builder()
                                .loteInversionista(loteBogExt)
                                .montoAmortizado(new BigDecimal("1000000"))
                                .fechaAmortizacion(LocalDateTime.now().minusDays(8))
                                .tipo(TipoAmortizacion.PAGO_MANUAL)
                                .notas("Abono manual extraordinario realizado en efectivo por la gerencia")
                                .build();

                AmortizacionDeuda amortManual2 = AmortizacionDeuda.builder()
                                .loteInversionista(loteMedExt)
                                .montoAmortizado(new BigDecimal("500000"))
                                .fechaAmortizacion(LocalDateTime.now().minusDays(2))
                                .tipo(TipoAmortizacion.PAGO_MANUAL)
                                .notas("Abono parcial manual por transferencia bancaria")
                                .build();

                amortizacionDeudaRepository.saveAll(List.of(amortManual1, amortManual2));
                System.out.println(">>> Amortizaciones manuales de deuda sembradas");

                // 10. Sembrar Gastos Hormiga
                GastoHormiga gastoBog1 = GastoHormiga.builder()
                                .descripcion("Flete e importación de cajas Lote A")
                                .monto(new BigDecimal("80000"))
                                .fechaGasto(LocalDateTime.now().minusDays(15))
                                .categoria(CategoriaGasto.FLETE)
                                .loteInversionista(loteBogA)
                                .negocio(bogota)
                                .build();

                GastoHormiga gastoBog2 = GastoHormiga.builder()
                                .descripcion("Almuerzo de trabajo con proveedores mayoristas")
                                .monto(new BigDecimal("45000"))
                                .fechaGasto(LocalDateTime.now().minusDays(8))
                                .categoria(CategoriaGasto.ALIMENTACION)
                                .negocio(bogota)
                                .build();

                GastoHormiga gastoMed1 = GastoHormiga.builder()
                                .descripcion("Moto-domicilio para entrega de combos especiales")
                                .monto(new BigDecimal("25000"))
                                .fechaGasto(LocalDateTime.now().minusDays(4))
                                .categoria(CategoriaGasto.TRANSPORTE)
                                .negocio(medellin)
                                .build();

                GastoHormiga gastoMed2 = GastoHormiga.builder()
                                .descripcion("Compra de cintas de embalaje y cartón")
                                .monto(new BigDecimal("15000"))
                                .fechaGasto(LocalDateTime.now().minusDays(2))
                                .categoria(CategoriaGasto.OTRO)
                                .negocio(medellin)
                                .build();

                gastoHormigaRepository.saveAll(List.of(gastoBog1, gastoBog2, gastoMed1, gastoMed2));
                System.out.println(">>> Gastos hormiga sembrados para ambas sedes");

                // 11. Sembrar Registro Cajas Abiertas (Apertura/Desglose de cajas)
                RegistroCajaAbierta aperturaBog = RegistroCajaAbierta.builder()
                                .inventario(stockBogA_caja)
                                .cantidadCajas(2)
                                .sobresAdicionados(208)
                                .fechaApertura(LocalDateTime.now().minusDays(12))
                                .build();
                registroCajaAbiertaRepository.save(aperturaBog);
                System.out.println(">>> Registro de desglose de cajas sembrado");

                // 12. Sembrar Auditoría
                Auditoria log1 = Auditoria.builder()
                                .usuario("vector")
                                .accion("INICIO_SESION")
                                .detalle("El usuario vector inició sesión y seleccionó la sede Panini Bogotá")
                                .fecha(LocalDateTime.now().minusDays(15))
                                .negocio(bogota)
                                .build();

                Auditoria log2 = Auditoria.builder()
                                .usuario("donato")
                                .accion("CARGA_INICIAL")
                                .detalle("Se inicializaron los stocks físicos para el Lote Inversión A Bogotá")
                                .fecha(LocalDateTime.now().minusDays(15))
                                .negocio(bogota)
                                .build();

                Auditoria log3 = Auditoria.builder()
                                .usuario("donato")
                                .accion("CONVERSIÓN_STOCK")
                                .detalle("Se abrieron 2 cajas de sobres del lote Lote Inversión A Bogotá. Stock sumó 208 sobres.")
                                .fecha(LocalDateTime.now().minusDays(12))
                                .negocio(bogota)
                                .build();

                Auditoria log4 = Auditoria.builder()
                                .usuario("chefcito")
                                .accion("REGISTRO_GASTO")
                                .detalle("Se registró un gasto por concepto de transporte por un monto de $25,000 en Panini Medellín")
                                .fecha(LocalDateTime.now().minusDays(4))
                                .negocio(medellin)
                                .build();

                auditoriaRepository.saveAll(List.of(log1, log2, log3, log4));
                System.out.println(">>> Registros de auditoría sembrados");

                System.out.println(">>> ¡Base de datos limpia y poblada con datos de prueba ricos exitosamente!");
        }
}
