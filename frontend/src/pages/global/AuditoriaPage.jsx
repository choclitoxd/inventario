import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';
import useAdminDB from '../../hooks/useAdminDB';
import AuditLogsTable from '../../components/features/global/AuditLogsTable';

function AuditoriaPage() {
  const {
    auditLogs,
    auditLoading,
    auditError,
    fetchAuditLogs
  } = useAdminDB();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sports text-white flex items-center gap-2">
          <Activity className="text-neonCyan animate-pulse" size={24} />
          BITÁCORA DE AUDITORÍA
        </h1>
        <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
          Trazabilidad total de eventos, modificaciones y acciones operativas del sistema
        </p>
      </div>

      <div className="animate-fadeIn">
        <AuditLogsTable 
          auditLogs={auditLogs}
          auditLoading={auditLoading}
          auditError={auditError}
          onRefresh={fetchAuditLogs}
        />
      </div>
    </div>
  );
}

export default AuditoriaPage;
