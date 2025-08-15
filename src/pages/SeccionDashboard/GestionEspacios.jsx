import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import { authFetch, clearAuth, getUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CrearEspacioModal from "../../components/Estacionamiento/CrearEspacioModal"; // ✅ AGREGAR ESTO
import EditarEspacioModal from "../../components/Estacionamiento/EditarEspacioModal";
export default function GestionEspacios() {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_ADMIN");

  const [espacios, setEspacios] = useState([]);
  const [showCrear, setShowCrear] = useState(false);
  const [espacioEdit, setEspacioEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar permisos
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Acceso denegado: Solo administradores pueden gestionar espacios");
      navigate("/dashboard");
      return;
    }
    fetchEspacios();
  }, [isAdmin, navigate]);

  // Cargar todos los espacios
  const fetchEspacios = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/espacios/todos');
      const data = await res.json();
      setEspacios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar espacios:", error);
      toast.error("Error al cargar espacios");
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de espacio
  const cambiarEstado = async (espacioId, nuevoEstado) => {
    try {
      const res = await authFetch(`/api/admin/espacios/${espacioId}/estado?nuevoEstado=${nuevoEstado}`, {
        method: 'PUT'
      });
      const result = await res.json();
      toast.success(result.message);
      fetchEspacios(); // Recargar
    } catch (error) {
      toast.error(error.message || "Error al cambiar estado");
    }
  };

  // Eliminar espacio
  const eliminarEspacio = async (espacioId, numeroEspacio) => {
    if (!window.confirm(`¿Eliminar permanentemente el espacio ${numeroEspacio}?`)) return;
    
    try {
      const res = await authFetch(`/api/admin/espacios/${espacioId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      toast.success(result.message);
      fetchEspacios(); // Recargar
    } catch (error) {
      toast.error(error.message || "Error al eliminar espacio");
    }
  };

  // Función para obtener clase de color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "DISPONIBLE": return "bg-green-100 text-green-800";
      case "OCUPADO": return "bg-red-100 text-red-800";
      case "RESERVADO": return "bg-yellow-100 text-yellow-800";
      case "MANTENIMIENTO": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (!isAdmin) return null;

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Espacios</h1>
            <p className="text-gray-300 mt-1">
              Crear, editar y gestionar espacios de estacionamiento
            </p>
          </div>
          <button
            onClick={() => setShowCrear(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Crear Espacio
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Total Espacios</div>
          <div className="text-2xl font-bold text-white">{espacios.length}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Disponibles</div>
          <div className="text-2xl font-bold text-green-400">
            {espacios.filter(e => e.estado === "DISPONIBLE").length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Ocupados</div>
          <div className="text-2xl font-bold text-red-400">
            {espacios.filter(e => e.estado === "OCUPADO").length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Mantenimiento</div>
          <div className="text-2xl font-bold text-gray-400">
            {espacios.filter(e => e.estado === "MANTENIMIENTO").length}
          </div>
        </div>
      </div>

      {/* Tabla de espacios */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tarifa/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    Cargando espacios...
                  </td>
                </tr>
              ) : espacios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No hay espacios registrados
                  </td>
                </tr>
              ) : (
                espacios.map((espacio) => (
                  <tr key={espacio.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{espacio.numero}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{espacio.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(espacio.estado)}`}>
                        {espacio.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">S/ {espacio.tarifaPorHora}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-xs truncate">
                        {espacio.descripcion || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* Cambiar estado */}
                        <select
                          value={espacio.estado}
                          onChange={(e) => cambiarEstado(espacio.id, e.target.value)}
                          disabled={espacio.estado === "OCUPADO"}
                          className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
                        >
                          <option value="DISPONIBLE">Disponible</option>
                          <option value="RESERVADO">Reservado</option>
                          <option value="MANTENIMIENTO">Mantenimiento</option>
                        </select>

                        {/* Editar */}
                        <button
                          onClick={() => setEspacioEdit(espacio)}
                          className="text-blue-400 hover:text-blue-300 px-2 py-1"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        {/* Eliminar (solo si no está ocupado) */}
                        {espacio.estado !== "OCUPADO" && (
                          <button
                            onClick={() => eliminarEspacio(espacio.id, espacio.numero)}
                            className="text-red-400 hover:text-red-300 px-2 py-1"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCrear && (
        <CrearEspacioModal
          open={showCrear}
          onClose={() => setShowCrear(false)}
          onCreated={() => {
            fetchEspacios();
            setShowCrear(false);
          }}
        />
      )}

      {espacioEdit && (
        <EditarEspacioModal
          espacio={espacioEdit}
          open={!!espacioEdit}
          onClose={() => setEspacioEdit(null)}
          onUpdated={() => {
            fetchEspacios();
            setEspacioEdit(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}