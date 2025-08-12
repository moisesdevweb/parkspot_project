import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

function validar(form) {
  // Username: solo letras, números, guion y guion bajo, sin espacios
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(form.username)) {
    return "El usuario solo puede tener letras, números, guion y guion bajo (3-20 caracteres, sin espacios)";
  }
  // Email
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
    return "El correo no es válido";
  }
  // Contraseña: solo letras y números, mínimo 6
  if (!/^[a-zA-Z0-9]{6,}$/.test(form.password)) {
    return "La contraseña debe tener al menos 6 caracteres y solo letras o números";
  }
  // DNI: solo números, 8 dígitos
  if (!/^\d{8}$/.test(form.dni)) {
    return "El DNI debe tener 8 dígitos";
  }
  // Teléfono: solo números, mínimo 7
  if (!/^\d{7,}$/.test(form.telefono)) {
    return "El teléfono debe tener al menos 7 dígitos";
  }
  // Placa: letras y números, sin espacios
  if (!/^[A-Z0-9-]{5,10}$/i.test(form.placa)) {
    return "La placa debe tener entre 5 y 10 caracteres, solo letras, números o guion";
  }
  // Año: 4 dígitos
  if (!/^\d{4}$/.test(form.año)) {
    return "El año debe tener 4 dígitos";
  }
  // Marca, modelo, color, tipo: no vacíos
  if (!form.marca || !form.modelo || !form.color || !form.tipoVehiculo) {
    return "Completa todos los datos del vehículo";
  }
  return null;
}

export default function ModalRegistrarCliente({ open, onClose, onRegistrado }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nombreCompleto: "",
    apellidos: "",
    dni: "",
    direccion: "",
    telefono: "",
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    año: "",
    tipoVehiculo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const error = validar(form);
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/persona/registrar-cliente-completo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar cliente");
      toast.success("Cliente registrado exitosamente");
      setForm({
        username: "",
        email: "",
        password: "",
        nombreCompleto: "",
        apellidos: "",
        dni: "",
        direccion: "",
        telefono: "",
        placa: "",
        marca: "",
        modelo: "",
        color: "",
        año: "",
        tipoVehiculo: "",
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
            Registrar Cliente
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="text-blue-300 font-semibold">Datos personales</div>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} placeholder="Nombre Completo" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <div className="text-blue-300 font-semibold mt-4">Datos del vehículo</div>
            <input name="placa" value={form.placa} onChange={handleChange} placeholder="Placa" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="color" value={form.color} onChange={handleChange} placeholder="Color" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <input name="año" value={form.año} onChange={handleChange} placeholder="Año" required className="w-full px-3 py-2 rounded bg-gray-700 text-white" />
            <select
              name="tipoVehiculo"
              value={form.tipoVehiculo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            >
              <option value="">Selecciona tipo de vehículo</option>
              <option value="AUTO">Auto</option>
              <option value="MOTO">Moto</option>
              <option value="CAMIONETA">Camioneta</option>
              <option value="SUV">SUV</option>
            </select>
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