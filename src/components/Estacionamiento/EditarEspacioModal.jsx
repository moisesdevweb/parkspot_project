import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/api";
import toast from "react-hot-toast";

export default function EditarEspacioModal({ espacio, open, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
    tarifaPorHora: "",
    estado: "DISPONIBLE"
  });
  const [loading, setLoading] = useState(false);

  // ✅ USAR useEffect para llenar el formulario cuando cambie el espacio
  useEffect(() => {
    if (espacio) {
      console.log("📋 Espacio recibido:", espacio); // Debug para ver qué llega
      setFormData({
        tipo: typeof espacio.tipo === "string" ? espacio.tipo : (espacio.tipo?.name || ""),
        descripcion: espacio.descripcion || "",
        tarifaPorHora: espacio.tarifaPorHora || "", // ✅ Cambié de tarifaHora a tarifaPorHora
        estado: espacio.estado || "DISPONIBLE"
      });
    }
  }, [espacio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!espacio) return;
    
    setLoading(true);

    try {
      const res = await authFetch(`/api/admin/espacios/${espacio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.tipo,
          descripcion: formData.descripcion || null,
          tarifaPorHora: parseFloat(formData.tarifaPorHora),
          estado: formData.estado
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar espacio");
      }

      const result = await res.json();
      toast.success(result.message || "Espacio actualizado exitosamente");
      onUpdated();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar espacio");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!open || !espacio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            Editar Espacio {espacio.numero}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white text-2xl font-bold disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Vehículo *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Seleccionar tipo</option>
              <option value="REGULAR">Regular</option>
              <option value="DISCAPACITADO">Discapacitado</option>
              <option value="MOTO">Moto</option>
              <option value="CAMIONETA">Camioneta</option>
            </select>
          </div>

          {/* Tarifa por Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tarifa por Hora (S/) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="999.99"
              value={formData.tarifaPorHora}
              onChange={(e) => setFormData({...formData, tarifaPorHora: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={espacio.estado === "OCUPADO" || loading}
            >
              <option value="DISPONIBLE">Disponible</option>
              <option value="RESERVADO">Reservado</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              {espacio.estado === "OCUPADO" && (
                <option value="OCUPADO">Ocupado</option>
              )}
            </select>
            {espacio.estado === "OCUPADO" && (
              <p className="text-yellow-400 text-xs mt-1">
                ⚠️ No se puede cambiar el estado de un espacio ocupado
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="3"
              placeholder="Descripción opcional del espacio..."
              maxLength="255"
              disabled={loading}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                "Actualizar Espacio"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}