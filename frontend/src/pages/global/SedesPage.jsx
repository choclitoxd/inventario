import React, { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import useAdminDB from '../../hooks/useAdminDB';
import SedeForm from '../../components/features/global/SedeForm';

function SedesPage() {
  const {
    negocioNombre,
    setNegocioNombre,
    negocioLoading,
    negocioSuccess,
    negocioError,
    negociosList,
    fetchStatsAndLists,
    handleCreateNegocio
  } = useAdminDB();

  useEffect(() => {
    fetchStatsAndLists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sports text-white flex items-center gap-2">
          <Building2 className="text-neonCyan animate-pulse" size={24} />
          GESTIÓN DE SEDES / NEGOCIOS
        </h1>
        <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
          Alta de nuevas sedes operativas, edición y visualización del listado general
        </p>
      </div>

      <div className="animate-fadeIn">
        <SedeForm 
          negocioNombre={negocioNombre}
          setNegocioNombre={setNegocioNombre}
          negocioLoading={negocioLoading}
          negocioSuccess={negocioSuccess}
          negocioError={negocioError}
          onCreateNegocio={handleCreateNegocio}
          negociosList={negociosList}
        />
      </div>
    </div>
  );
}

export default SedesPage;
