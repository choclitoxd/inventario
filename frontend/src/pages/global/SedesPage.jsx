import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import useSedesManagement from '../../hooks/useSedesManagement';
import SedeForm from '../../components/features/global/sedes/SedeForm';
import SedesTable from '../../components/features/global/sedes/SedesTable';
import EditarSedeModal from '../../components/features/global/sedes/EditarSedeModal';

function SedesPage() {
  const {
    loading,
    error,
    success,
    nombreSede,
    setNombreSede,
    selectedJefesIds,
    setSelectedJefesIds,
    searchText,
    setSearchText,
    filterOwner,
    setFilterOwner,
    editingSede,
    setEditingSede,
    showEditModal,
    setShowEditModal,
    jefesOnly,
    filteredSedes,
    SedeOwnersArray,
    handleCreateSede,
    handleUpdateSede,
    handleDeleteSede
  } = useSedesManagement();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sports text-white flex items-center gap-2">
          <Building2 className="text-neonCyan animate-pulse" size={24} />
          GESTIÓN DE SEDES / NEGOCIOS
        </h1>
        <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
          Alta de nuevas sedes operativas, edición, visualización y filtros por socio asignado
        </p>
      </div>

      {success && (
        <div className="bg-neonGreen/10 border border-neonGreen/45 text-neonGreen p-3.5 rounded-xl text-xs font-semibold animate-fadeIn">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <SedeForm
            nombreSede={nombreSede}
            setNombreSede={setNombreSede}
            selectedJefesIds={selectedJefesIds}
            setSelectedJefesIds={setSelectedJefesIds}
            jefesOnly={jefesOnly}
            handleCreateSede={handleCreateSede}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-2">
          <SedesTable
            filteredSedes={filteredSedes}
            searchText={searchText}
            setSearchText={setSearchText}
            filterOwner={filterOwner}
            setFilterOwner={setFilterOwner}
            jefesOnly={jefesOnly}
            onEditClick={(sede) => {
              setEditingSede(sede);
              setShowEditModal(true);
            }}
            onDeleteClick={handleDeleteSede}
            SedeOwnersArray={SedeOwnersArray}
          />
        </div>
      </div>

      <EditarSedeModal
        isOpen={showEditModal}
        sede={editingSede}
        onClose={() => {
          setShowEditModal(false);
          setEditingSede(null);
        }}
        onSave={handleUpdateSede}
        jefesOnly={jefesOnly}
        loading={loading}
      />
    </div>
  );
}

export default SedesPage;

