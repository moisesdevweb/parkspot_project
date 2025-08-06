import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function UserTable({ users = [], onEdit, onView, loading = false }) {
  return (
    <div className="bg-[#23272f] rounded-2xl shadow-xl p-4 overflow-x-auto">
      {loading && (
        <div className="text-white mb-2">Cargando...</div>
      )}
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm">
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Usuario</th>
            <th className="py-3 px-4">Rol</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No hay usuarios para mostrar
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-[#2c313a] transition"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src="/avatar.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-white font-medium">
                      {user.nombreCompleto}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-white">{user.username}</td>
                <td className="py-3 px-4">
                  {Array.isArray(user.roles) && user.roles.length > 0 ? (
                    user.roles.map((rol, idx) => (
                      <span
                        key={rol + idx}
                        className="bg-blue-700/40 text-blue-200 px-2 py-1 rounded text-xs font-semibold mr-1"
                      >
                        {rol
                          .replace('ROLE_', '')
                          .toLowerCase()
                          .replace(/^\w/, c => c.toUpperCase())}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {user.estado === 1 ? (
                    <span className="bg-green-700/30 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-700/30 text-red-400 px-2 py-1 rounded text-xs font-semibold">
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="hover:bg-gray-700 p-1 rounded transition"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="hover:bg-blue-700 p-1 rounded transition"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-400" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}