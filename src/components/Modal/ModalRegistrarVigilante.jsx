import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { authFetch } from "../../utils/api";

export default function ModalRegistrarVigilante({ open, onClose, onRegistrado }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nombreCompleto: "",
    apellidos: "",
    dni: "",
    direccion: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validaciones básicas
    if (!form.username || !form.email || !form.password || !form.nombreCompleto || !form.apellidos || !form.dni || !form.direccion || !form.telefono) {
      toast.error("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/admin-vigilante/registrar-vigilante", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          role: ["vigilante"], // Solo vigilante
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar vigilante");
      toast.success("Vigilante registrado exitosamente");
      setForm({
        username: "",
        email: "",
        password: "",
        nombreCompleto: "",
        apellidos: "",
        dni: "",
        direccion: "",
        telefono: "",
      });
      onRegistrado();
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
            Registrar Vigilante
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} placeholder="Nombre Completo" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <button type="submit" disabled={loading} className="bg-blue-700 text-white px-4 py-2 rounded mt-2 hover:bg-blue-800 transition w-full">
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
          <button onClick={onClose} className="mt-6 px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition w-full">Cerrar</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}