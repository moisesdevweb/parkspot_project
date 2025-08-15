import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import toast from "react-hot-toast";

export default function ModalCrearReserva({ open, onClose, espacio, onReservaCreada }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoId, setVehiculoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log("🚗 Cargando vehículos del cliente...");
      authFetch("/api/cliente/mis-vehiculos")
        .then(res => res.json())
        .then(data => {
          console.log("🚗 Vehículos recibidos:", data);
          setVehiculos(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("❌ Error cargando vehículos:", err);
          setVehiculos([]);
        });
      setVehiculoId("");
      setFechaInicio("");
      setFechaFin("");
      setObservaciones("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehiculoId || !fechaInicio || !fechaFin) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/cliente/crear-reserva", {
        method: "POST",
        body: JSON.stringify({
          espacioId: espacio.id,
          vehiculoId,
          fechaInicio,
          fechaFin,
          observaciones,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear reserva");
      toast.success(data.message || "Reserva creada correctamente");
      onReservaCreada?.();
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-6">
          Reservar espacio {espacio?.numero}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Vehículo
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={vehiculoId}
              onChange={e => setVehiculoId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.id}>
                  {v.placa} - {v.marca} {v.modelo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Fecha y hora inicio
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Fecha y hora fin
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Observaciones
            </label>
            <textarea
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={3}
              disabled={loading}
              placeholder="Comentarios adicionales (opcional)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Reservando..." : "Reservar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}