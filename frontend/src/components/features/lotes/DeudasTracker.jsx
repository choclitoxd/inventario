import React from 'react';
import { DollarSign } from 'lucide-react';
import DeudaLoteCard from './DeudaLoteCard';

function DeudasTracker({
  deudas,
  showAbonoForm,
  setShowAbonoForm,
  abonoMonto,
  setAbonoMonto,
  abonoNotas,
  setAbonoNotas,
  handleRegistrarAbono,
  formatCOP,
  loading
}) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <DollarSign size={18} className="text-red-500" /> Amortizaciones y Saldos Pendientes (Proveedores)
      </h3>

      {deudas.length === 0 ? (
        <div className="p-8 text-center text-carbon-600 font-semibold border-2 border-dashed border-carbon-800 rounded-xl">
          No hay deudas activas registradas con inversionistas externos en este momento.
        </div>
      ) : (
        <div className="space-y-4">
          {deudas.map((lote) => (
            <DeudaLoteCard
              key={lote.id}
              lote={lote}
              showAbonoForm={showAbonoForm}
              setShowAbonoForm={setShowAbonoForm}
              abonoMonto={abonoMonto}
              setAbonoMonto={setAbonoMonto}
              abonoNotas={abonoNotas}
              setAbonoNotas={setAbonoNotas}
              handleRegistrarAbono={handleRegistrarAbono}
              formatCOP={formatCOP}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DeudasTracker;
