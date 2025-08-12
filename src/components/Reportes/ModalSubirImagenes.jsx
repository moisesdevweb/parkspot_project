import { Dialog } from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "../../utils/api";

export default function ModalSubirImagenes({ open, onClose, reporte, onSubido }) {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!reporte) return null;

  const handleFileChange = (e) => {
    setArchivos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivos.length) {
      toast.error("Selecciona al menos una imagen");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      archivos.forEach(file => formData.append("imagenes", file));
      const res = await authFetch(`/api/reportes/${reporte.id}/imagenes`, {
        method: "POST",
        body: formData,
        headers: {}, // No poner Content-Type, el navegador lo pone
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al subir imágenes");
      toast.success("Imágenes subidas exitosamente");
      onSubido && onSubido();
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
            Subir Imágenes al Reporte #{reporte.id}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-white"
            />
            <div className="flex flex-wrap gap-2">
              {archivos.map((file, idx) => (
                <span key={idx} className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                  {file.name}
                </span>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded mt-2 hover:bg-green-800 transition w-full"
            >
              {loading ? "Subiendo..." : "Subir Imágenes"}
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