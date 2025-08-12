import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "../../utils/api";

export default function ModalCrearReporte({ open, onClose, onCreado }) {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar clientes al abrir
  useEffect(() => {
    if (open) {
      authFetch("/api/persona/listar-clientes")
        .then(res => res.json())
        .then(data => setClientes(data))
        .catch(() => setClientes([]));
      setVehiculos([]);
      setClienteId("");
      setVehiculoId("");
      setDescripcion("");
    }
  }, [open]);

  // Cargar vehículos del cliente seleccionado
  useEffect(() => {
    if (clienteId) {
      authFetch(`/api/reportes/vehiculos-cliente/${clienteId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Vehículos recibidos:", data); // <-- Verifica aquí
          setVehiculos(Array.isArray(data) ? data : []);
        })
        .catch(() => setVehiculos([]));
    } else {
      setVehiculos([]);
    }
    setVehiculoId("");
  }, [clienteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteId || !vehiculoId || !descripcion || vehiculos.length === 0) {
      toast.error("Completa todos los campos y asegúrate que el cliente tenga vehículos");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/reportes/crear", {
        method: "POST",
        body: JSON.stringify({
          clienteId,
          vehiculoId,
          descripcion,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear reporte");
      toast.success("Reporte creado exitosamente");
      onCreado && onCreado();
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-[#23272f] rounded-2xl p-8 shadow-xl w-full max-w-lg">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            Nuevo Reporte de Incidencia
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-300 mb-1">Cliente</label>
              <select
                className="w-full rounded bg-gray-800 text-white px-3 py-2"
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                required
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombreCompleto} {c.apellidos} (DNI: {c.dni})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Vehículo</label>
              <select
                className="w-full rounded bg-gray-800 text-white px-3 py-2"
                value={vehiculoId}
                onChange={e => setVehiculoId(e.target.value)}
                required
                disabled={!clienteId}
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.length === 0 && clienteId && (
                  <option value="" disabled>No hay vehículos para este cliente</option>
                )}
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.marca} {v.modelo} {v.anio ? `(${v.anio})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Descripción</label>
              <textarea
                className="w-full rounded bg-gray-800 text-white px-3 py-2"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
                rows={3}
                placeholder="Describe la incidencia..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white px-4 py-2 rounded mt-2 hover:bg-blue-800 transition w-full"
            >
              {loading ? "Creando..." : "Crear Reporte"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition w-full"
            >
              Cancelar
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}