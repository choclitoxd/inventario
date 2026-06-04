import React, { useEffect } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';

function DbBackupRestore({
  onDownloadBackup,
  restoreFile,
  setRestoreFile,
  restoreLoading,
  restoreSuccess,
  setRestoreSuccess,
  restoreError,
  setRestoreError,
  onRestoreBackup
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (restoreFile) {
      onRestoreBackup(restoreFile);
    }
  };

  useEffect(() => {
    if (restoreSuccess) {
      const fileInput = document.getElementById('backup-file-input');
      if (fileInput) fileInput.value = '';
    }
  }, [restoreSuccess]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Descargar Backup */}
      <div className="glass-panel p-6 border border-carbon-800 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-sports font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Download size={16} className="text-neonCyan" />
            Descargar Copia de Seguridad
          </h3>
          <p className="text-xs text-carbon-400 leading-relaxed mt-2">
            Genera un archivo de respaldo estructurado en formato **SQL** portable. Este archivo incluirá la información de negocios, usuarios, clientes, productos, inventarios y transacciones (ventas, gastos, amortizaciones) actuales.
          </p>
        </div>

        <div className="bg-neonCyan/10 border border-neonCyan/25 p-3 rounded-xl text-[11px] text-neonCyan font-semibold flex gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            El respaldo se autodesactivará temporalmente las restricciones de claves foráneas para asegurar una futura restauración limpia.
          </span>
        </div>

        <button
          onClick={onDownloadBackup}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-cyan shadow-neon-cyan"
        >
          <Download size={14} />
          <span>DESCARGAR RESPALDO (.SQL)</span>
        </button>
      </div>

      {/* Restaurar Backup */}
      <div className="glass-panel p-6 border border-carbon-800 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-sports font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Upload size={16} className="text-neonGreen" />
            Restaurar Copia de Seguridad
          </h3>
          <p className="text-xs text-carbon-400 leading-relaxed mt-2">
            Sube un archivo de respaldo **.sql** generado previamente para restaurar el estado de las tablas de inmediato.
          </p>
        </div>

        {restoreSuccess && (
          <div className="bg-neonGreen/10 border border-neonGreen/45 text-neonGreen p-3 rounded-xl text-[11px] font-semibold">
            ¡Base de datos restaurada con éxito! Todos los paneles han sido actualizados.
          </div>
        )}

        {restoreError && (
          <div className="bg-red-950/30 border border-red-500/50 text-red-200 p-3 rounded-xl text-[11px] font-mono whitespace-pre-wrap break-all leading-normal">
            {restoreError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <input
              id="backup-file-input"
              type="file"
              accept=".sql"
              onChange={(e) => {
                setRestoreFile(e.target.files[0]);
                setRestoreError(null);
                setRestoreSuccess(false);
              }}
              className="block w-full text-xs text-zinc-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:text-xs file:font-sports file:font-bold file:tracking-wider
                file:bg-carbon-800 file:text-white
                hover:file:bg-carbon-700
                cursor-pointer focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={restoreLoading || !restoreFile}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-green shadow-neon-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {restoreLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={14} />
                <span>RESTAURAR RESPALDO</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DbBackupRestore;
