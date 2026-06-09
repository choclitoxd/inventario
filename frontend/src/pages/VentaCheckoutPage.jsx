import React from 'react';
import { ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import useVentaCheckout from '../hooks/useVentaCheckout';
import ClienteFacturacion from '../components/features/ventas/ClienteFacturacion';
import LineasVenta from '../components/features/ventas/LineasVenta';
import ResumenFactura from '../components/features/ventas/ResumenFactura';

function VentaCheckoutPage() {
  const {
    productos,
    inventarios,
    telefono,
    setTelefono,
    nombre,
    setNombre,
    clienteEncontrado,
    setClienteEncontrado,
    clienteId,
    setClienteId,
    metodoPago,
    setMetodoPago,
    detalles,
    loading,
    error,
    success,
    preciosSugeridos,
    handleBuscarCliente,
    handleAgregarFila,
    handleCambiarProducto,
    handleUpdateItem,
    handleUpdateComboComponent,
    handleRemoverFila,
    calcularTotal,
    handleRealizarVenta,
    formatCOP
  } = useVentaCheckout();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <ShoppingCart className="text-neonGreen" /> Registrar Venta de Contado
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Checkout rápido para clientes mayoristas con precios editables al instante</p>
        </div>
      </div>

      {success && (
        <div className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen p-4 rounded-xl flex items-center gap-3 shadow-neon-green">
          <Check className="flex-shrink-0" />
          <span className="text-sm font-semibold">
            ¡Venta registrada con éxito! El inventario ha sido descontado y las ganancias se asignaron a los inversionistas automáticamente.
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleRealizarVenta} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Client & Items */}
        <div className="lg:col-span-2 space-y-6">
          <ClienteFacturacion
            telefono={telefono}
            setTelefono={setTelefono}
            nombre={nombre}
            setNombre={setNombre}
            clienteEncontrado={clienteEncontrado}
            setClienteEncontrado={setClienteEncontrado}
            clienteId={clienteId}
            setClienteId={setClienteId}
          />

          <LineasVenta
            detalles={detalles}
            productos={productos}
            inventarios={inventarios}
            preciosSugeridos={preciosSugeridos}
            handleAgregarFila={handleAgregarFila}
            handleCambiarProducto={handleCambiarProducto}
            handleUpdateItem={handleUpdateItem}
            handleUpdateComboComponent={handleUpdateComboComponent}
            handleRemoverFila={handleRemoverFila}
            formatCOP={formatCOP}
          />
        </div>

        {/* Right Sidebar - Checkout Summary */}
        <div className="lg:col-span-1">
          <ResumenFactura
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            detalles={detalles}
            calcularTotal={calcularTotal}
            formatCOP={formatCOP}
            loading={loading}
          />
        </div>

      </form>
      
    </div>
  );
}

export default VentaCheckoutPage;
