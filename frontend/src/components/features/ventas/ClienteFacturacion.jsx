import React from 'react';
import { User } from 'lucide-react';

function ClienteFacturacion({
  telefono,
  setTelefono,
  nombre,
  setNombre,
  clienteEncontrado,
  handleBuscarCliente
}) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <User size={18} className="text-neonGreen" /> Información del Cliente
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-carbon-500">TELÉFONO (ID ÚNICO)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. 3123456789"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen flex-1"
            />
            <button
              type="button"
              onClick={handleBuscarCliente}
              className="bg-carbon-700 hover:bg-carbon-600 text-zinc-100 px-4 rounded-xl text-xs font-semibold border border-carbon-600 transition-all"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-carbon-500">NOMBRE DEL CLIENTE</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={clienteEncontrado}
            className={`bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen ${
              clienteEncontrado ? 'opacity-60 cursor-not-allowed bg-carbon-900 border-carbon-800' : ''
            }`}
          />
        </div>
      </div>
      
      {clienteEncontrado && (
        <span className="text-xs text-neonGreen font-semibold block">
          ✓ Cliente encontrado en la base de datos (se vinculará a la venta).
        </span>
      )}
      {!clienteEncontrado && telefono.trim() && (
        <span className="text-xs text-yellow-500 font-semibold block">
          ⚠ Cliente nuevo. Se registrará "al vuelo" con el nombre proporcionado.
        </span>
      )}
    </div>
  );
}

export default ClienteFacturacion;
