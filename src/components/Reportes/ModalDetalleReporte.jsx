import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "../../utils/api";

const estadoOptions = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "APROBADO", label: "Aprobado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export default function ModalDetalleReporte({ open, onClose, reporte, modo = "admin", onActualizado }) {
  const [estado, setEstado] = useState(reporte?.estado || "PENDIENTE");
  const [comentario, setComentario] = useState(reporte?.comentarioAdmin || "");
  const [loading, setLoading] = useState(false);

  // Sincroniza el estado del select cada vez que cambia el reporte
  useEffect(() => {
    setEstado(reporte?.estado || "PENDIENTE");
    setComentario(reporte?.comentarioAdmin || "");
  }, [reporte]);

  if (!reporte) return null;

  const handleActualizarEstado = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/reportes/${reporte.id}/estado`, {
        method: "PUT",
        body: JSON.stringify({
          nuevoEstado: estado,
          comentarioAdmin: comentario,
        }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      toast.success("Estado actualizado");
      onActualizado && onActualizado();
      onClose();
    } catch (err) {
      toast.error(err.message || "Error al actualizar");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-[#23272f] rounded-2xl p-8 shadow-xl w-full max-w-2xl relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-white mb-2">Detalle del Reporte #{reporte.id}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            <div>
              <p><b>Estado:</b> <span className="font-semibold">{reporte.estado}</span></p>
              <p><b>Fecha:</b> {new Date(reporte.fechaCreacion).toLocaleString()}</p>
              <p><b>Cliente:</b> {reporte.clienteNombre} {reporte.clienteApellidos} (DNI: {reporte.clienteDni})</p>
              <p><b>Vehículo:</b> {reporte.vehiculoPlaca} - {reporte.vehiculoMarca} {reporte.vehiculoModelo}</p>
              <p><b>Vigilante:</b> {reporte.vigilanteNombre} ({reporte.vigilanteUsername})</p>
              {reporte.adminActualizadorNombre && (
                <p><b>Admin que actualizó:</b> {reporte.adminActualizadorNombre}</p>
              )}
            </div>
            <div>
              <p><b>Descripción:</b></p>
              <div className="bg-gray-800 rounded p-3 text-gray-100">{reporte.descripcion}</div>
              <p className="mt-2"><b>Comentario Admin:</b></p>
              <div className="bg-gray-800 rounded p-3 text-gray-100">{reporte.comentarioAdmin || "Sin comentario"}</div>
            </div>
          </div>
          {/* Imágenes */}
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-2">Imágenes</h3>
            <div className="flex flex-wrap gap-4">
              {reporte.imagenes && reporte.imagenes.length > 0 ? (
                reporte.imagenes.map(img => (
                  <a
                    key={img.id}
                    href={img.urlDescarga}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={img.urlDescarga}
                      alt={img.nombreArchivo}
                      className="w-32 h-32 object-cover rounded shadow"
                    />
                  </a>
                ))
              ) : (
                <span className="text-gray-400">No hay imágenes</span>
              )}
            </div>
          </div>
          {/* Solo admin puede cambiar estado */}
          {modo === "admin" && (
            <div className="mt-6">
              <label className="block text-gray-300 mb-1">Actualizar Estado</label>
              <select
                className="w-full rounded bg-gray-800 text-white px-3 py-2 mb-2"
                value={estado}
                onChange={e => setEstado(e.target.value)}
              >
                {estadoOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <textarea
                className="w-full rounded bg-gray-800 text-white px-3 py-2 mb-2"
                placeholder="Comentario del admin (opcional)"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                onClick={handleActualizarEstado}
                disabled={loading}
              >
                Guardar Cambios
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}