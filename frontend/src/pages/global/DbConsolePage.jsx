import React, { useEffect } from 'react';
import { Database } from 'lucide-react';
import useAdminDB from '../../hooks/useAdminDB';
import DbHealthStats from '../../components/features/global/DbHealthStats';
import DbSpaceChart from '../../components/features/global/DbSpaceChart';
import DbTablesMeta from '../../components/features/global/DbTablesMeta';
import SqlPlayground from '../../components/features/global/SqlPlayground';
import DbBackupRestore from '../../components/features/global/DbBackupRestore';

function DbConsolePage() {
  const {
    dbHealth,
    dbHealthLoading,
    dbHealthError,
    sqlQuery,
    setSqlQuery,
    queryResult,
    queryLoading,
    queryError,
    restoreFile,
    setRestoreFile,
    restoreLoading,
    restoreSuccess,
    setRestoreSuccess,
    restoreError,
    setRestoreError,
    fetchDbHealth,
    fetchStatsAndLists,
    handleExecuteSql,
    handleDownloadBackup,
    handleRestoreBackup
  } = useAdminDB();

  useEffect(() => {
    fetchDbHealth();
    fetchStatsAndLists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sports text-white flex items-center gap-2">
          <Database className="text-neonCyan animate-pulse" size={24} />
          CONSOLA DE BASE DE DATOS
        </h1>
        <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
          Estado físico, latencia, conexiones activas y consola de comandos SQL directos
        </p>
      </div>

      <div className="space-y-6 animate-fadeIn">
        <DbHealthStats 
          dbHealth={dbHealth} 
          dbHealthLoading={dbHealthLoading} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DbSpaceChart 
            dbHealth={dbHealth} 
            dbHealthLoading={dbHealthLoading} 
            dbHealthError={dbHealthError} 
          />
          <DbTablesMeta 
            dbHealth={dbHealth} 
            dbHealthLoading={dbHealthLoading} 
            onRefresh={fetchDbHealth} 
          />
        </div>

        <SqlPlayground 
          sqlQuery={sqlQuery}
          setSqlQuery={setSqlQuery}
          queryResult={queryResult}
          queryLoading={queryLoading}
          queryError={queryError}
          onExecuteSql={handleExecuteSql}
        />

        <DbBackupRestore 
          onDownloadBackup={handleDownloadBackup}
          restoreFile={restoreFile}
          setRestoreFile={setRestoreFile}
          restoreLoading={restoreLoading}
          restoreSuccess={restoreSuccess}
          setRestoreSuccess={setRestoreSuccess}
          restoreError={restoreError}
          setRestoreError={setRestoreError}
          onRestoreBackup={handleRestoreBackup}
        />
      </div>
    </div>
  );
}

export default DbConsolePage;
