import React, { useState, useEffect, useRef } from 'react';
import { User, X, Search, Check, Plus, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';

function ClienteFacturacion({
  telefono,
  setTelefono,
  nombre,
  setNombre,
  clienteEncontrado,
  setClienteEncontrado,
  clienteId,
  setClienteId
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  // Modal creation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Sync searchQuery with selected client
  useEffect(() => {
    if (clienteId && telefono && nombre) {
      setSearchQuery(`${nombre} - [${telefono}]`);
    } else if (!telefono && !nombre) {
      setSearchQuery('');
    }
  }, [clienteId, telefono, nombre]);

  // Click outside search container to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!searchQuery.trim() || (clienteId && searchQuery === `${nombre} - [${telefono}]`)) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await api.buscarClientesPredictivo(searchQuery);
        setSearchResults(data || []);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, clienteId, telefono, nombre]);

  const handleSelectCliente = (c) => {
    setClienteId(c.id);
    setNombre(c.nombre);
    setTelefono(c.telefono);
    setClienteEncontrado(true);
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setClienteId(null);
    setTelefono('');
    setNombre('');
    setClienteEncontrado(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleOpenModal = () => {
    // If the searchQuery is numeric, prefill it as phone number
    if (/^\d+$/.test(searchQuery.trim())) {
      setNewTelefono(searchQuery.trim());
    } else {
      setNewTelefono('');
    }
    setNewNombre('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    if (!newNombre.trim() || !newTelefono.trim()) {
      setModalError('Por favor complete todos los campos.');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const saved = await api.registrarCliente({
        nombre: newNombre.trim(),
        telefono: newTelefono.trim()
      });
      if (saved) {
        // Inject as active customer
        setClienteId(saved.id);
        setNombre(saved.nombre);
        setTelefono(saved.telefono);
        setClienteEncontrado(true);
        setIsModalOpen(false);
      }
    } catch (err) {
      setModalError(err.message || 'Error al guardar el cliente.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <div className="glass-panel p-6 space-y-4" ref={containerRef}>
        <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
          <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
            <User size={18} className="text-neonGreen" /> Información del Cliente
          </h3>
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus size={14} />
            Agregar Cliente
          </button>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-bold text-carbon-500">BÚSQUEDA DE CLIENTE (NOMBRE O TELÉFONO)</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-zinc-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Escribe el nombre o teléfono del cliente..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={!!clienteId}
              className={`bg-carbon-800 border border-carbon-700 rounded-xl pl-9 pr-8 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen w-full ${
                clienteId ? 'opacity-80 cursor-not-allowed bg-carbon-900 border-carbon-800' : ''
              }`}
            />
            {(searchQuery.trim() || clienteId) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 text-zinc-500 hover:text-red-500 transition-colors"
                title="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown Predictivo */}
          {showDropdown && searchQuery.trim() && !(clienteId && searchQuery === `${nombre} - [${telefono}]`) && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-carbon-900 border border-carbon-800 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-fadeIn">
              <div className="py-1">
                {isSearching && (
                  <div className="px-4 py-2 text-xs text-zinc-555 italic">Buscando...</div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  searchResults.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCliente(c)}
                      className="px-4 py-2 hover:bg-carbon-800 text-zinc-300 hover:text-white cursor-pointer text-xs flex justify-between items-center transition-colors"
                    >
                      <span className="font-semibold">{c.nombre}</span>
                      <span className="text-zinc-500 font-mono text-[11px]">[{c.telefono}]</span>
                    </div>
                  ))
                )}

                {!isSearching && searchResults.length === 0 && (
                  <div className="px-4 py-3 text-xs text-zinc-555 italic flex flex-col gap-1">
                    <span>No se encontraron coincidencias.</span>
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="text-left text-neonGreen hover:text-neonGreen/80 font-bold underline mt-1 animate-pulse"
                    >
                      + Registrar como cliente nuevo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {clienteEncontrado && (
          <span className="text-xs text-neonGreen font-semibold flex items-center gap-1.5 animate-fadeIn">
            <Check size={14} /> Cliente seleccionado (vínculo automático a la venta).
          </span>
        )}
      </div>

      {/* Modal Compacto de Registro Express */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative z-50 overflow-visible flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 bg-transparent">
              <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
                <User className="text-emerald-500 animate-pulse" size={18} /> Agregar Nuevo Cliente
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCliente} className="space-y-4">
              {modalError && (
                <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3 rounded-xl flex items-center gap-2 font-semibold text-xs">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Teléfono (ID Único)</label>
                <input
                  type="text"
                  placeholder="Ej. 3123456789"
                  value={newTelefono}
                  onChange={(e) => setNewTelefono(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  {modalLoading ? 'Guardando...' : 'Guardar y Seleccionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ClienteFacturacion;
