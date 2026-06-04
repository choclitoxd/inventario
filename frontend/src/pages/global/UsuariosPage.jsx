import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import useUsuariosManagement from '../../hooks/useUsuariosManagement';
import UsuarioForm from '../../components/features/global/usuarios/UsuarioForm';
import UsuariosTable from '../../components/features/global/usuarios/UsuariosTable';
import EditarUsuarioModal from '../../components/features/global/usuarios/EditarUsuarioModal';

function UsuariosPage() {
  const {
    loading,
    error,
    success,
    activeUser,
    userForm,
    setUserForm,
    searchText,
    setSearchText,
    filterRol,
    setFilterRol,
    editingUsuario,
    setEditingUsuario,
    showEditModal,
    setShowEditModal,
    filteredUsuarios,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
  } = useUsuariosManagement();

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
          <UsuarioForm
            userForm={userForm}
            setUserForm={setUserForm}
            userLoading={loading}
            handleCreateUser={handleCreateUser}
          />
        </div>

        <div className="lg:col-span-2">
          <UsuariosTable
            filteredUsuarios={filteredUsuarios}
            searchText={searchText}
            setSearchText={setSearchText}
            filterRol={filterRol}
            setFilterRol={setFilterRol}
            activeUser={activeUser}
            onEditClick={(user) => {
              setEditingUsuario(user);
              setShowEditModal(true);
            }}
            onDeleteClick={handleDeleteUser}
          />
        </div>
      </div>

      <EditarUsuarioModal
        isOpen={showEditModal}
        usuario={editingUsuario}
        onClose={() => {
          setShowEditModal(false);
          setEditingUsuario(null);
        }}
        onSave={handleUpdateUser}
        loading={loading}
      />
    </div>
  );
}

export default UsuariosPage;

