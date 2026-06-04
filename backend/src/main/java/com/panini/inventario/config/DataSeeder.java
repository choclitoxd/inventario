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

    private final NegocioRepository negocioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final LoteInversionistaRepository loteInversionistaRepository;
    private final InventarioRepository inventarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Businesses
        Negocio bogota = null;
        Negocio medellin = null;
        if (negocioRepository.count() == 0) {
            bogota = Negocio.builder()
                    .nombre("Panini Bogotá")
                    .build();
            medellin = Negocio.builder()
                    .nombre("Panini Medellín")
                    .build();

            bogota = negocioRepository.save(bogota);
            medellin = negocioRepository.save(medellin);
            System.out.println(">>> Negocios de prueba sembrados: Panini Bogotá, Panini Medellín");
        } else {
            List<Negocio> negocios = negocioRepository.findAll();
            for (Negocio n : negocios) {
                if (n.getNombre().contains("Bogotá")) bogota = n;
                if (n.getNombre().contains("Medellín")) medellin = n;
            }
        }

        // 2. Seed Users
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
                    .rol("JEFE")
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
            System.out.println(">>> Usuarios de prueba sembrados: donato (ADMIN), giank (JEFE), vector (VENDEDOR), chefcito (VENDEDOR)");
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

            album = productoRepository.save(album);
            cajaSobres = productoRepository.save(cajaSobres);
            sobreSuelto = productoRepository.save(sobreSuelto);
            System.out.println(">>> Catálogo de productos de prueba sembrado");
        } else {
            album = productoRepository.findAll().stream().filter(p -> p.getTipo() == Tipo.ALBUM).findFirst().orElse(null);
            cajaSobres = productoRepository.findAll().stream().filter(p -> p.getTipo() == Tipo.LAMINAS && p.getNombre().contains("Caja")).findFirst().orElse(null);
            sobreSuelto = productoRepository.findAll().stream().filter(p -> p.getTipo() == Tipo.LAMINAS && p.getNombre().contains("Sobre")).findFirst().orElse(null);
        }

        // 4. Seed Clients per Business
        if (clienteRepository.count() == 0) {
            if (bogota != null) {
                Cliente clienteBogota = Cliente.builder()
                        .nombre("Distribuidor Panini Bogotá")
                        .telefono("3001234567")
                        .negocio(bogota)
                        .build();
                clienteRepository.save(clienteBogota);
            }
            if (medellin != null) {
                Cliente clienteMedellin = Cliente.builder()
                        .nombre("Distribuidor Panini Medellín")
                        .telefono("3007654321")
                        .negocio(medellin)
                        .build();
                clienteRepository.save(clienteMedellin);
            }
            System.out.println(">>> Clientes de prueba sembrados por negocio");
        }

        // 5. Seed Lots per Business
        LoteInversionista loteBogota = null;
        LoteInversionista loteMedellin = null;
        if (loteInversionistaRepository.count() == 0) {
            if (bogota != null) {
                loteBogota = LoteInversionista.builder()
                        .nombreLote("Importación Bogotá Inversionista Externo")
                        .financiador(Financiador.INVERSIONISTA_EXTERNO)
                        .nombreInversionista("Felipe Restrepo")
                        .montoPrestado(new BigDecimal("5000000"))
                        .saldoPendiente(new BigDecimal("5000000"))
                        .porcentajeGananciaAmortizacion(new BigDecimal("50.00"))
                        .estado(Estado.ACTIVO)
                        .negocio(bogota)
                        .build();
                loteBogota = loteInversionistaRepository.save(loteBogota);
            }

            if (medellin != null) {
                loteMedellin = LoteInversionista.builder()
                        .nombreLote("Importación Medellín Inversionista Externo")
                        .financiador(Financiador.INVERSIONISTA_EXTERNO)
                        .nombreInversionista("Felipe Restrepo")
                        .montoPrestado(new BigDecimal("3000000"))
                        .saldoPendiente(new BigDecimal("3000000"))
                        .porcentajeGananciaAmortizacion(new BigDecimal("50.00"))
                        .estado(Estado.ACTIVO)
                        .negocio(medellin)
                        .build();
                loteMedellin = loteInversionistaRepository.save(loteMedellin);
            }
            System.out.println(">>> Lotes de inversión de prueba sembrados por negocio");
        } else {
            List<LoteInversionista> lotes = loteInversionistaRepository.findAll();
            for (LoteInversionista l : lotes) {
                if (l.getNegocio() != null && l.getNegocio().getId().equals(bogota.getId())) loteBogota = l;
                if (l.getNegocio() != null && l.getNegocio().getId().equals(medellin.getId())) loteMedellin = l;
            }
        }

        // 6. Seed Inventory Stock per Lot/Business
        if (inventarioRepository.count() == 0) {
            // Stockholm Bogotá
            if (loteBogota != null) {
                if (album != null) {
                    Inventario invAlbum = Inventario.builder()
                            .producto(album)
                            .loteInversionista(loteBogota)
                            .cantInicialPacas(2)      // 2 pacas = 52 álbumes
                            .cantInicialCajas(0)
                            .cantInicialUnidades(10)  // 10 unidades sueltas
                            .cantActualPacas(2)
                            .cantActualCajas(0)
                            .cantActualUnidades(10)
                            .costoCompraPaca(new BigDecimal("182000"))
                            .costoCompraCaja(BigDecimal.ZERO)
                            .costoCompraUnidad(new BigDecimal("7000"))
                            .build();
                    inventarioRepository.save(invAlbum);
                }
                if (cajaSobres != null) {
                    Inventario invCaja = Inventario.builder()
                            .producto(cajaSobres)
                            .loteInversionista(loteBogota)
                            .cantInicialPacas(1)      // 1 paca = 10 cajas
                            .cantInicialCajas(5)      // 5 cajas sueltas
                            .cantInicialUnidades(20)  // 20 sobres sueltos
                            .cantActualPacas(1)
                            .cantActualCajas(5)
                            .cantActualUnidades(20)
                            .costoCompraPaca(new BigDecimal("2500000"))
                            .costoCompraCaja(new BigDecimal("260000"))
                            .costoCompraUnidad(new BigDecimal("2500"))
                            .build();
                    inventarioRepository.save(invCaja);
                }
            }

            // Stockholm Medellín
            if (loteMedellin != null) {
                if (album != null) {
                    Inventario invAlbum = Inventario.builder()
                            .producto(album)
                            .loteInversionista(loteMedellin)
                            .cantInicialPacas(1)      // 1 paca = 26 álbumes
                            .cantInicialCajas(0)
                            .cantInicialUnidades(5)
                            .cantActualPacas(1)
                            .cantActualCajas(0)
                            .cantActualUnidades(5)
                            .costoCompraPaca(new BigDecimal("182000"))
                            .costoCompraCaja(BigDecimal.ZERO)
                            .costoCompraUnidad(new BigDecimal("7000"))
                            .build();
                    inventarioRepository.save(invAlbum);
                }
                if (cajaSobres != null) {
                    Inventario invCaja = Inventario.builder()
                            .producto(cajaSobres)
                            .loteInversionista(loteMedellin)
                            .cantInicialPacas(0)
                            .cantInicialCajas(8)      // 8 cajas sueltas
                            .cantInicialUnidades(50)  // 50 sobres sueltos
                            .cantActualPacas(0)
                            .cantActualCajas(8)
                            .cantActualUnidades(50)
                            .costoCompraPaca(new BigDecimal("2500000"))
                            .costoCompraCaja(new BigDecimal("260000"))
                            .costoCompraUnidad(new BigDecimal("2500"))
                            .build();
                    inventarioRepository.save(invCaja);
                }
            }
            System.out.println(">>> Inventarios de prueba sembrados por negocio");
        }
    }
}
