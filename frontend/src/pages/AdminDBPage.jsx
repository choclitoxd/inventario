import React, { useState } from 'react';
import { Database } from 'lucide-react';
import useAdminDB from '../hooks/useAdminDB';
import DbHealthStats from '../components/features/global/DbHealthStats';
import DbSpaceChart from '../components/features/global/DbSpaceChart';
import DbTablesMeta from '../components/features/global/DbTablesMeta';
import SqlPlayground from '../components/features/global/SqlPlayground';
import DbBackupRestore from '../components/features/global/DbBackupRestore';
import SedeForm from '../components/features/global/SedeForm';
import UsuarioForm from '../components/features/global/UsuarioForm';
import AuditLogsTable from '../components/features/global/AuditLogsTable';

function AdminDBPage() {
  const [activeSubTab, setActiveSubTab] = useState('console'); // console, management, audit

  const {
    negocioNombre,
    setNegocioNombre,
    negocioLoading,
    negocioSuccess,
    negocioError,
    userForm,
    setUserForm,
    userLoading,
    userSuccess,
    userError,
    negociosList,
    usuariosList,
    auditLogs,
    auditLoading,
    auditError,
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
    fetchAuditLogs,
    handleExecuteSql,
    handleDownloadBackup,
    handleRestoreBackup,
    handleCreateNegocio,
    handleCreateUser
  } = useAdminDB();

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sports text-white flex items-center gap-2">
            <Database className="text-neonCyan animate-pulse" size={24} />
            CONSOLA DE ADMINISTRACIÓN GLOBAL
          </h1>
          <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
            Administración de base de datos, usuarios, sedes y auditoría del sistema
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-carbon-900 border border-carbon-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sports font-bold tracking-wider transition-all ${
              activeSubTab === 'console' 
                ? 'bg-neonCyan text-black shadow-neon-cyan shadow-sm' 
                : 'text-carbon-500 hover:text-white'
            }`}
          >
            CONSOLA DB
          </button>
          <button
            onClick={() => setActiveSubTab('management')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sports font-bold tracking-wider transition-all ${
              activeSubTab === 'management' 
                ? 'bg-neonCyan text-black shadow-neon-cyan shadow-sm' 
                : 'text-carbon-500 hover:text-white'
            }`}
          >
            SEDES/USUARIOS
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sports font-bold tracking-wider transition-all ${
              activeSubTab === 'audit' 
                ? 'bg-neonCyan text-black shadow-neon-cyan shadow-sm' 
                : 'text-carbon-500 hover:text-white'
            }`}
          >
            AUDITORÍA
          </button>
        </div>
      </div>

      {/* subtab 1: Consola DB */}
      {activeSubTab === 'console' && (
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
      )}

      {/* subtab 2: Gestión de Sedes y Usuarios */}
      {activeSubTab === 'management' && (
        <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
          <SedeForm 
            negocioNombre={negocioNombre}
            setNegocioNombre={setNegocioNombre}
            negocioLoading={negocioLoading}
            negocioSuccess={negocioSuccess}
            negocioError={negocioError}
            onCreateNegocio={handleCreateNegocio}
            negociosList={negociosList}
          />
          
          <UsuarioForm 
            userForm={userForm}
            setUserForm={setUserForm}
            userLoading={userLoading}
            userSuccess={userSuccess}
            userError={userError}
            onCreateUser={handleCreateUser}
            usuariosList={usuariosList}
          />
        </div>
      )}

      {/* subtab 3: Bitácora de Auditoría */}
      {activeSubTab === 'audit' && (
        <AuditLogsTable 
          auditLogs={auditLogs}
          auditLoading={auditLoading}
          auditError={auditError}
          onRefresh={fetchAuditLogs}
        />
      )}
    </div>
  );
}

export default AdminDBPage;
