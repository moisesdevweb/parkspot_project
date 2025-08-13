import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/api";
import toast from "react-hot-toast";

export default function CrearEspacioModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    numero: "",
    tipo: "REGULAR", // ← CAMBIO: usar valor de la BD
    estado: "DISPONIBLE",
    descripcion: "",
    tarifaPorHora: 5,
  });
  const [loading, setLoading] = useState(false);

  // Resetear formulario cuando se abra el modal
  useEffect(() => {
    if (open) {
      setForm({
        numero: "",
        tipo: "REGULAR", // ← CAMBIO: usar valor de la BD
        estado: "DISPONIBLE",
        descripcion: "",
        tarifaPorHora: 5,
      });
    }
  }, [open]);

  if (!open) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: name === "tarifaPorHora" ? parseFloat(value) || 0 : value 
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.numero?.trim()) return toast.error("Ingresa el número del espacio");
    if (form.tarifaPorHora <= 0) return toast.error("La tarifa debe ser mayor a 0");

    setLoading(true);
    try {
      console.log("Enviando datos:", {
        numero: form.numero.trim().toUpperCase(),
        tipo: form.tipo,
        estado: form.estado,
        descripcion: form.descripcion?.trim() || "",
        tarifaPorHora: form.tarifaPorHora,
      });

      const res = await authFetch("/api/admin/espacios/crear", {
        method: "POST",
        body: JSON.stringify({
          numero: form.numero.trim().toUpperCase(),
          tipo: form.tipo,
          estado: form.estado,
          descripcion: form.descripcion?.trim() || "",
          tarifaPorHora: form.tarifaPorHora,
        }),
      });
      
      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      
      if (!res.ok) throw new Error(data.message || "Error al crear espacio");
      
      toast.success(data.message || "Espacio creado exitosamente");
      onCreated?.();
      onClose?.();
    } catch (err) {
      console.error("Error creando espacio:", err);
      toast.error(err.message || "Error interno del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-gray-700 bg-[#1b2129] p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Crear nuevo espacio</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Número del Espacio <span className="text-red-400">*</span>
            </label>
            <input
              name="numero"
              value={form.numero}
              onChange={onChange}
              placeholder="Ej: A1, B12, C001"
              className="w-full rounded bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Tipo de Espacio <span className="text-red-400">*</span>
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={onChange}
                className="w-full rounded bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="REGULAR">🚗 REGULAR</option>
                <option value="DISCAPACITADO">♿ DISCAPACITADO</option>
                <option value="CAMIONETA">🚚 CAMIONETA</option>
                <option value="MOTO">🏍️ MOTO</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Estado Inicial</label>
              <select
                name="estado"
                value={form.estado}
                onChange={onChange}
                className="w-full rounded bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="DISPONIBLE">✅ DISPONIBLE</option>
                <option value="RESERVADO">🔒 RESERVADO</option>
                <option value="MANTENIMIENTO">⚠️ MANTENIMIENTO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Tarifa por Hora (S/.) <span className="text-red-400">*</span>
              </label>
              <input
                name="tarifaPorHora"
                value={form.tarifaPorHora}
                onChange={onChange}
                type="number"
                step="0.50"
                min="0.50"
                className="w-full rounded bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={onChange}
                placeholder="Opcional"
                className="w-full rounded bg-gray-800 text-white px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60 transition-colors"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Espacio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}