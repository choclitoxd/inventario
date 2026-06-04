import React from 'react';
import { Coins, CheckCircle, AlertTriangle } from 'lucide-react';
import useLotesDeudas from '../hooks/useLotesDeudas';
import CrearLoteForm from '../components/features/lotes/CrearLoteForm';
import DeudasTracker from '../components/features/lotes/DeudasTracker';
import HistoricoLotesTable from '../components/features/lotes/HistoricoLotesTable';

function LotesDeudasPage() {
  const {
    productos,
    deudas,
    lotes,
    loading,
    error,
    success,
    nombreLote,
    setNombreLote,
    financiador,
    setFinanciador,
    nombreInversionista,
    setNombreInversionista,
    deudaInicial,
    setDeudaInicial,
    porcentajeAmortizacion,
    setPorcentajeAmortizacion,
    productoId,
    setProductoId,
    cantPacas,
    setCantPacas,
    cantCajas,
    setCantCajas,
    cantUnidades,
    setCantUnidades,
    costoPaca,
    setCostoPaca,
    costoCaja,
    setCostoCaja,
    costoUnidad,
    setCostoUnidad,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleCrearLote,
    handleRegistrarAbono,
    formatCOP
  } = useLotesDeudas();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Coins className="text-neonCyan" /> Lotes de Mercancía e Inversionistas
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Trazabilidad por origen de capital, control de amortizaciones y abonos</p>
        </div>
      </div>

      {success && (
        <div className="bg-neonCyan/10 border border-neonCyan/30 text-neonCyan p-4 rounded-xl flex items-center gap-3 shadow-neon-cyan animate-fadeIn">
          <CheckCircle className="flex-shrink-0" />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Deudas/Historical Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CrearLoteForm
            productos={productos}
            loading={loading}
            nombreLote={nombreLote}
            setNombreLote={setNombreLote}
            financiador={financiador}
            setFinanciador={setFinanciador}
            nombreInversionista={nombreInversionista}
            setNombreInversionista={setNombreInversionista}
            deudaInicial={deudaInicial}
            setDeudaInicial={setDeudaInicial}
            porcentajeAmortizacion={porcentajeAmortizacion}
            setPorcentajeAmortizacion={setPorcentajeAmortizacion}
            productoId={productoId}
            setProductoId={setProductoId}
            cantPacas={cantPacas}
            setCantPacas={setCantPacas}
            cantCajas={cantCajas}
            setCantCajas={setCantCajas}
            cantUnidades={cantUnidades}
            setCantUnidades={setCantUnidades}
            costoPaca={costoPaca}
            setCostoPaca={setCostoPaca}
            costoCaja={costoCaja}
            setCostoCaja={setCostoCaja}
            costoUnidad={costoUnidad}
            setCostoUnidad={setCostoUnidad}
            handleCrearLote={handleCrearLote}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DeudasTracker
            deudas={deudas}
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

          <HistoricoLotesTable
            lotes={lotes}
            formatCOP={formatCOP}
          />
        </div>
      </div>

    </div>
  );
}

export default LotesDeudasPage;
