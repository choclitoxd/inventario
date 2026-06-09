import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ClienteFacturacion from './ClienteFacturacion';
import { ventasService } from '../../../services/ventasService';

vi.mock('../../../services/ventasService', () => ({
  ventasService: {
    buscarClientesPredictivo: vi.fn(),
    registrarCliente: vi.fn(),
  }
}));

describe('ClienteFacturacion Component Tests', () => {
  test('Autocomplete flow: simulates typing, triggers debounce, and displays list', async () => {
    const mockResults = [
      { id: 10, nombre: 'Victor Gomez', telefono: '3009998877' }
    ];
    ventasService.buscarClientesPredictivo.mockResolvedValue(mockResults);

    render(
      <ClienteFacturacion
        telefono=""
        setTelefono={vi.fn()}
        nombre=""
        setNombre={vi.fn()}
        clienteEncontrado={false}
        setClienteEncontrado={vi.fn()}
        clienteId={null}
        setClienteId={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Escribe el nombre o teléfono del cliente...');
    
    // Type query
    fireEvent.change(input, { target: { value: 'Vic' } });

    // Wait 400ms for the debounce (300ms) to trigger and complete the API request
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    // Verify it was called
    expect(ventasService.buscarClientesPredictivo).toHaveBeenCalledWith('Vic');

    // Wait for the dropdown results to render
    await waitFor(() => {
      expect(screen.getByText('Victor Gomez')).toBeInTheDocument();
    });

    // Verify it renders in the absolute list which has absolute class
    const dropdown = screen.getByText('Victor Gomez').closest('.absolute');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.className).toContain('absolute');
  });

  test('Modal Flow: validates properties fixed inset-0 z-50 and bg-zinc-950 on inputs', () => {
    render(
      <ClienteFacturacion
        telefono=""
        setTelefono={vi.fn()}
        nombre=""
        setNombre={vi.fn()}
        clienteEncontrado={false}
        setClienteEncontrado={vi.fn()}
        clienteId={null}
        setClienteId={vi.fn()}
      />
    );

    // Open the modal
    const addBtn = screen.getByText('Agregar Cliente');
    fireEvent.click(addBtn);

    // Check modal overlay container has classes fixed inset-0 z-50
    const modalContainer = screen.getByText('Agregar Nuevo Cliente').closest('.fixed');
    expect(modalContainer).toBeInTheDocument();
    expect(modalContainer.className).toContain('fixed');
    expect(modalContainer.className).toContain('inset-0');
    expect(modalContainer.className).toContain('z-50');

    // Check inputs inherit the dark background bg-zinc-950
    const phoneInput = screen.getByPlaceholderText('Ej. 3123456789');
    const nameInput = screen.getByPlaceholderText('Ej. Juan Pérez');

    expect(phoneInput.className).toContain('bg-zinc-950');
    expect(nameInput.className).toContain('bg-zinc-950');
  });
});
