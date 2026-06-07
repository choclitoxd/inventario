import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventarioGlobal from './InventarioGlobal';

describe('InventarioGlobal Component Tab Switching', () => {
  const mockInventario = [
    {
      id: 1,
      producto: {
        id: 10,
        nombre: 'Caja de Laminas Qatar',
        tipo: 'FRACCIONADO_LAMINAS',
        codigoBarras: '7701',
        edicionColeccion: 'Qatar 2022'
      },
      loteInversionista: {
        negocio: {
          id: 1,
          nombre: 'Bogota'
        }
      },
      cantActualPacas: 2,
      cantActualCajas: 5,
      cantActualUnidades: 10,
      costoCompraCaja: 260000,
      costoCompraUnidad: 2500
    },
    {
      id: 2,
      producto: {
        id: 11,
        nombre: 'Album Qatar 2022',
        tipo: 'FRACCIONADO_ALBUMES',
        codigoBarras: '7702',
        edicionColeccion: 'Qatar 2022'
      },
      loteInversionista: {
        negocio: {
          id: 1,
          nombre: 'Bogota'
        }
      },
      cantActualPacas: 1,
      cantActualCajas: 3,
      cantActualUnidades: 15,
      costoCompraUnidad: 10000
    }
  ];

  const mockSedes = [{ id: 1, nombre: 'Bogota' }];
  const mockTotales = {
    totalPacas: 3,
    totalCajas: 8,
    totalSobres: 25,
    totalCatalogo: 2
  };
  const formatCOP = (val) => `$${val}`;

  test('al hacer clic en la pestana "Albumes" debe mostrar columnas de unidades y ocultar las columnas complejas P / C / S', () => {
    render(
      <InventarioGlobal
        inventarioGlobal={mockInventario}
        sedes={mockSedes}
        totales={mockTotales}
        loading={false}
        error={null}
        successMsg={null}
        submitting={false}
        onCrearProducto={vi.fn()}
        onEditarProducto={vi.fn()}
        onEliminarProducto={vi.fn()}
        onAbrirCaja={vi.fn()}
        formatCOP={formatCOP}
      />
    );

    // Al inicio debe estar seleccionada la pestana "Cajas y Laminas" por defecto
    // Por lo tanto, las columnas complejas de LaminasTable (PACAS, CAJAS, SOBRES) deben estar presentes
    expect(screen.getByText('PACAS')).toBeInTheDocument();
    expect(screen.getByText('SOBRES')).toBeInTheDocument();
    
    // Verificamos que se renderiza el producto de laminas
    expect(screen.getByText('Caja de Laminas Qatar')).toBeInTheDocument();

    // Hacemos clic en la pestana "ALBUMES"
    const albumesTabBtn = screen.getByRole('button', { name: /ÁLBUMES/i });
    fireEvent.click(albumesTabBtn);

    // Ahora la tabla de albumes debe mostrarse y la tabla de laminas debe ocultarse.
    // La columna "CAJAS / UNIDADES" (de AlbumesTable) debe aparecer
    expect(screen.getByText('CAJAS / UNIDADES')).toBeInTheDocument();
    expect(screen.getByText('Album Qatar 2022')).toBeInTheDocument();

    // Y las columnas especificas de LaminasTable (PACAS, SOBRES) deben desaparecer por completo
    expect(screen.queryByText('SOBRES')).not.toBeInTheDocument();
  });
});
