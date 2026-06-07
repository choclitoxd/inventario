import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UsuariosTable from './UsuariosTable';

describe('UsuariosTable Component', () => {
  const mockUsuarios = [
    { id: 1, nombre: 'Donato', username: 'donato', rol: 'ADMIN' },
    { id: 2, nombre: 'Vector', username: 'vector', rol: 'ORGANIZADOR' }
  ];

  test('debe deshabilitar y aplicar cursor-not-allowed al boton de eliminar para el usuario activo', () => {
    const activeUser = { id: 1, username: 'donato', rol: 'ADMIN' };

    render(
      <UsuariosTable
        filteredUsuarios={mockUsuarios}
        searchText=""
        setSearchText={vi.fn()}
        filterRol=""
        setFilterRol={vi.fn()}
        activeUser={activeUser}
        onEditClick={vi.fn()}
        onDeleteClick={vi.fn()}
      />
    );

    // El boton de eliminar para Donato (ID 1, isSelf = true)
    const selfDeleteBtn = screen.getByTitle('No puedes auto-eliminarte');
    expect(selfDeleteBtn).toBeInTheDocument();
    expect(selfDeleteBtn).toBeDisabled();
    expect(selfDeleteBtn.className).toContain('cursor-not-allowed');

    // El boton de eliminar para Vector (ID 2, isSelf = false)
    const normalDeleteBtn = screen.getByTitle('Eliminar Usuario');
    expect(normalDeleteBtn).toBeInTheDocument();
    expect(normalDeleteBtn).not.toBeDisabled();
    expect(normalDeleteBtn.className).not.toContain('cursor-not-allowed');
  });
});
