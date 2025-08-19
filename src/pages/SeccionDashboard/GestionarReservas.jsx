import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import { authFetch, clearAuth, getUser } from "../../utils/api";
import toast from "react-hot-toast";

export default function GestionarReservas() {
  const navigate = useNavigate();
  const user = getUser();
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [loading, setLoading] = useState(false);
  const [procesando, setProcesando] = useState(null);

  const cargarReservas = async (estado = null) => {
    setLoading(true);
    try {
      const url = estado && estado !== "TODAS" 
        ? `/api/admin/reservas/estado/${estado}` // <-- CORREGIDO: era /reservas?estado=
        : "/api/admin/reservas";
      const res = await authFetch(url);
      const data = await res.json();
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error al cargar reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas(filtroEstado);
  }, [filtroEstado]);

  const procesarReserva = async (reservaId, accion) => {
    setProcesando(reservaId);
    try {
      const res = await authFetch(`/api/admin/reservas/${reservaId}/${accion}`, {
        method: "PUT"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al procesar reserva");
      
      toast.success(data.message || `Reserva ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} correctamente`);
      cargarReservas(filtroEstado); // Recargar lista
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcesando(null);
    }
  };

  const getEstadoBadge = (estado) => {
    const clases = {
      PENDIENTE: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      CONFIRMADA: "bg-green-500/20 text-green-400 border border-green-500/30",
      CANCELADA: "bg-red-500/20 text-red-400 border border-red-500/30",
      UTILIZADA: "bg-blue-500/20 text-blue-400 border border-blue-500/30"
    };
    return clases[estado] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Gestionar Reservas</h1>
          <p className="text-gray-300 mt-1">
            Administra las reservas de espacios de estacionamiento de los clientes
          </p>
        </div>

        {/* Filtros y estadísticas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-300 font-medium">Filtrar por estado:</label>
              <select
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="TODAS">Todas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="CANCELADA">Canceladas</option>
                <option value="UTILIZADA">Utilizadas</option>
              </select>
            </div>
            <div className="text-gray-400 text-sm">
              Total: {reservas.length} reserva{reservas.length !== 1 ? 's' : ''}
              {filtroEstado !== "TODAS" && ` (${filtroEstado.toLowerCase()})`}
            </div>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Cargando reservas...
            </div>
          ) : reservas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No hay reservas {filtroEstado !== "TODAS" && `en estado ${filtroEstado.toLowerCase()}`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Espacio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Fecha Reserva
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Periodo Solicitado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 text-white">
                        <div>
                          <div className="font-medium">{reserva.clienteNombre} {reserva.clienteApellidos}</div>
                          <div className="text-sm text-gray-400">DNI: {reserva.clienteDni}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {reserva.espacioNumero}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div>
                          <div className="font-medium">{reserva.vehiculoPlaca}</div>
                          <div className="text-sm text-gray-400">
                            {reserva.vehiculoMarca} {reserva.vehiculoModelo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatearFecha(reserva.fechaReserva)}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        <div className="space-y-1">
                          <div><strong>Inicio:</strong> {formatearFecha(reserva.fechaInicio)}</div>
                          <div><strong>Fin:</strong> {formatearFecha(reserva.fechaFin)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {reserva.estado === "PENDIENTE" && (
                            <>
                              <button
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                onClick={() => procesarReserva(reserva.id, "aprobar")}
                                disabled={procesando === reserva.id}
                              >
                                {procesando === reserva.id ? "..." : "Aprobar"}
                              </button>
                              <button
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                onClick={() => procesarReserva(reserva.id, "rechazar")}
                                disabled={procesando === reserva.id}
                              >
                                {procesando === reserva.id ? "..." : "Rechazar"}
                              </button>
                            </>
                          )}
                          {reserva.estado !== "PENDIENTE" && (
                            <span className="text-gray-500 text-xs">
                              {reserva.estado === "CONFIRMADA" ? "Aprobada" : 
                               reserva.estado === "CANCELADA" ? "Rechazada" : "Utilizada"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}