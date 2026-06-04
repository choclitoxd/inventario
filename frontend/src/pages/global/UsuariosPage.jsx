import React, { useEffect } from 'react';
import { Users } from 'lucide-react';
import useAdminDB from '../../hooks/useAdminDB';
import UsuarioForm from '../../components/features/global/UsuarioForm';

function UsuariosPage() {
  const {
    userForm,
    setUserForm,
    userLoading,
    userSuccess,
    userError,
    usuariosList,
    fetchStatsAndLists,
    handleCreateUser
  } = useAdminDB();

  useEffect(() => {
    fetchStatsAndLists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sports text-white flex items-center gap-2">
          <Users className="text-neonCyan animate-pulse" size={24} />
          CONTROL DE USUARIOS
        </h1>
        <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
          Asignación de credenciales, definición de roles jerárquicos y listado de personal
        </p>
      </div>

      <div className="animate-fadeIn">
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
    </div>
  );
}

export default UsuariosPage;
