import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const estadoOptions = [
  { value: 1, label: "Activo" },
  { value: 0, label: "Inactivo" },
];

// ✅ SOLO 4 TIPOS DE VEHÍCULO
const tipoVehiculoOptions = [
  { value: "AUTO", label: "Auto" },
  { value: "MOTO", label: "Moto" },
  { value: "CAMIONETA", label: "Camioneta" },
  { value: "SUV", label: "SUV" },
];

// campos: array de objetos { name, label, type, editable }
// 🎭 MODAL REUTILIZABLE - Se usa para clientes Y vigilantes
export default function ModalPersona({
  open,           // ✅ Controla si el modal está abierto
  onClose,        // ✅ Función para cerrar el modal
  persona,        // ✅ Datos de la persona a mostrar/editar
  onSave,         // ✅ Función que se ejecuta al guardar cambios
  mode = "view",  // 🔄 "view" = solo ver | "edit" = editar
  campos = [],    // 📝 Array que define qué campos mostrar y cuáles son editables
  titulo = "Detalle",        // 📌 Título del modal
  mostrarEstado = true,      // 🚦 Mostrar/ocultar selector de estado
  mostrarVehiculos = false,  // 🚗 Mostrar/ocultar sección de vehículos
}) {
  const [form, setForm] = useState({});
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    if (persona) {
      const initial = {};
      campos.forEach(c => {
        initial[c.name] = persona[c.name] ?? "";
      });
      if (mostrarEstado) initial.estado = persona.estado ?? 1;
      setForm(initial);
      setVehiculos(persona.vehiculos ? persona.vehiculos.map(v => ({ ...v })) : []);
    }
  }, [persona, campos, mostrarEstado]);

  if (!persona) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "estado" ? Number(value) : value });
  };

  // Vehículos handlers
  const handleVehiculoChange = (idx, field, value) => {
    setVehiculos(vehiculos =>
      vehiculos.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const handleAddVehiculo = () => {
    setVehiculos([
      ...vehiculos,
      { 
        placa: "", 
        marca: "", 
        modelo: "", 
        color: "", 
        año: "", 
        tipo: "AUTO" // ✅ VALOR POR DEFECTO
      },
    ]);
  };

  const handleRemoveVehiculo = idx => {
    setVehiculos(vehiculos => vehiculos.filter((_, i) => i !== idx));
  };

  function validar(form, vehiculos) {
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(form.username)) {
      return "El usuario solo puede tener letras, números, guion y guion bajo (3-20 caracteres, sin espacios)";
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) {
      return "El correo no es válido";
    }
    if (!/^\d{8}$/.test(form.dni)) {
      return "El DNI debe tener 8 dígitos";
    }
    if (!/^\d{7,}$/.test(form.telefono)) {
      return "El teléfono debe tener al menos 7 dígitos";
    }
    for (const v of vehiculos) {
      if (!/^[A-Z0-9-]{5,10}$/i.test(v.placa)) return "Placa inválida";
      if (!v.marca || !v.modelo || !v.color || !v.tipo) return "Completa todos los datos del vehículo";
      if (!/^\d{4}$/.test(v.año)) return "El año del vehículo debe tener 4 dígitos";
    }
    return null;
  }

  const handleSubmit = e => {
    e.preventDefault();
    const error = validar(form, vehiculos);
    if (error) {
      toast.error(error);
      return;
    }
    onSave({ ...persona, ...form, vehiculos });
  };

  const inputClass = editable =>
    `w-full rounded px-3 py-2 ${
      editable
        ? "bg-gray-800 text-white"
        : "bg-gray-700 text-gray-400 cursor-not-allowed"
    }`;

  // Nueva función para cerrar y resetear el form
  const handleClose = () => {
    if (persona) {
      const initial = {};
      campos.forEach(c => {
        initial[c.name] = persona[c.name] ?? "";
      });
      if (mostrarEstado) initial.estado = persona.estado ?? 1;
      setForm(initial);
      setVehiculos(persona.vehiculos ? persona.vehiculos.map(v => ({ ...v })) : []);
    }
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg rounded-2xl bg-[#23272f] p-8 shadow-xl">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                  onClick={handleClose}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/avatar.png" alt="avatar" className="w-16 h-16 rounded-full" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{titulo}</h2>
                    <p className="text-gray-400">{persona.email}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 📝 Los campos se definen desde el componente padre
                  Ejemplo: [{ name: "dni", label: "DNI", editable: true }] */}
                  {campos.map(campo => (
                    <div key={campo.name}>
                      <label className="block text-gray-300 text-sm mb-1">{campo.label}</label>
                      <input
                        className={inputClass(mode === "edit" && campo.editable)} // ✅ Solo editable si mode="edit" Y campo.editable=true
                        name={campo.name}
                        value={form[campo.name]}
                        onChange={handleChange}
                        disabled={mode === "view" || !campo.editable}            // 🔒 Deshabilitado en modo vista o si no es editable
                        type={campo.type || "text"}
                      />
                    </div>
                  ))}
                  {mostrarEstado && (
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Estado</label>
                      {mode === "edit" ? (
                        <select
                          name="estado"
                          value={form.estado}
                          onChange={handleChange}
                          className="w-full rounded bg-gray-800 text-white px-3 py-2"
                        >
                          {estadoOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="w-full rounded bg-gray-800 text-white px-3 py-2"
                          value={form.estado === 1 ? "Activo" : "Inactivo"}
                          disabled
                        />
                      )}
                    </div>
                  )}

                  {/* SOLO mostrar vehículos si mostrarVehiculos es true */}
                  {mostrarVehiculos && (
                    <div className="mt-6">
                      <h3 className="text-white font-semibold mb-2">Vehículos registrados</h3>
                      {vehiculos.length > 0 ? (
                        <ul className="space-y-2">
                          {vehiculos.map((v, idx) => (
                            <li key={v.id || idx} className="bg-gray-800 rounded p-3 text-white flex flex-col gap-1">
                              {mode === "edit" ? (
                                <>
                                  <input
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    placeholder="Placa"
                                    value={v.placa}
                                    onChange={e => handleVehiculoChange(idx, "placa", e.target.value)}
                                  />
                                  <input
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    placeholder="Marca"
                                    value={v.marca}
                                    onChange={e => handleVehiculoChange(idx, "marca", e.target.value)}
                                  />
                                  <input
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    placeholder="Modelo"
                                    value={v.modelo}
                                    onChange={e => handleVehiculoChange(idx, "modelo", e.target.value)}
                                  />
                                  <input
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    placeholder="Color"
                                    value={v.color}
                                    onChange={e => handleVehiculoChange(idx, "color", e.target.value)}
                                  />
                                  <input
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    placeholder="Año"
                                    value={v.año}
                                    onChange={e => handleVehiculoChange(idx, "año", e.target.value)}
                                  />
                                  {/* ✅ CAMBIAR ESTE INPUT POR SELECT */}
                                  <select
                                    className="bg-gray-900 text-white rounded px-2 py-1 mb-1"
                                    value={v.tipo || ""}
                                    onChange={e => handleVehiculoChange(idx, "tipo", e.target.value)}
                                  >
                                    <option value="">Seleccionar tipo</option>
                                    {tipoVehiculoOptions.map(opt => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    className="mt-1 px-2 py-1 bg-red-700 rounded text-white hover:bg-red-800 w-fit"
                                    onClick={() => handleRemoveVehiculo(idx)}
                                  >
                                    Quitar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span><b>Placa:</b> {v.placa}</span>
                                  <span><b>Marca:</b> {v.marca}</span>
                                  <span><b>Modelo:</b> {v.modelo}</span>
                                  <span><b>Color:</b> {v.color}</span>
                                  <span><b>Año:</b> {v.año}</span>
                                  <span><b>Tipo:</b> {v.tipo}</span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No hay vehículos registrados.</p>
                      )}
                      {mode === "edit" && (
                        <button
                          type="button"
                          className="mt-3 px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition"
                          onClick={handleAddVehiculo}
                        >
                          Agregar Vehículo
                        </button>
                      )}
                    </div>
                  )}
                  {mode === "edit" && (
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                        onClick={handleClose}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-2 transition"
                      >
                        <PencilIcon className="w-5 h-5" />
                        Guardar Cambios
                      </button>
                    </div>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}