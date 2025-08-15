// src/pages/Reservas.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DasboardGeneral/DashboardLayout";
import { authFetch, clearAuth, getUser } from "../utils/api";
import toast from "react-hot-toast";

function Reservas() {
  const navigate = useNavigate();
  const user = getUser();
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [loading, setLoading] = useState(false);

  const cargarReservas = async (estado = null) => {
    setLoading(true);
    try {
      const url =
        estado && estado !== "TODAS"
          ? `/api/cliente/mis-reservas/${estado}`
          : "/api/cliente/mis-reservas";
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

  const getEstadoBadge = (estado) => {
    const clases = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      CONFIRMADA: "bg-green-100 text-green-800",
      CANCELADA: "bg-red-100 text-red-800",
      UTILIZADA: "bg-blue-100 text-blue-800",
    };
    return clases[estado] || "bg-gray-100 text-gray-800";
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => {
        clearAuth();
        navigate("/login");
      }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Reservas</h1>
          <p className="text-gray-300 mt-1">
            Historial de reservas de espacios de estacionamiento
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <label className="text-gray-300 font-medium">Filtrar por estado:</label>
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="UTILIZADA">Utilizadas</option>
            </select>
            <span className="text-gray-400">
              ({reservas.length} reserva{reservas.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Cargando reservas...
            </div>
          ) : reservas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>
                No tienes reservas{" "}
                {filtroEstado !== "TODAS" && `en estado ${filtroEstado.toLowerCase()}`}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/dashboard/espacios")} // <-- CORREGIDO: era /dashboard/estacionamiento
              >
                Crear mi primera reserva
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Espacio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Fecha Reserva
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-750">
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
                        <div>
                          <div>
                            <strong>Inicio:</strong> {formatearFecha(reserva.fechaInicio)}
                          </div>
                          <div>
                            <strong>Fin:</strong> {formatearFecha(reserva.fechaFin)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                            reserva.estado
                          )}`}
                        >
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm max-w-xs">
                        {reserva.observaciones || "Sin observaciones"}
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

export default Reservas;
