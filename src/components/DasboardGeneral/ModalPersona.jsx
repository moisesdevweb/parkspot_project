import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

const estadoOptions = [
  { value: 1, label: "Activo" },
  { value: 0, label: "Inactivo" },
];

// campos: array de objetos { name, label, type, editable }
export default function ModalPersona({
  open,
  onClose,
  persona,
  onSave,
  mode = "view",
  campos = [],
  titulo = "Detalle",
  mostrarEstado = true,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (persona) {
      const initial = {};
      campos.forEach(c => {
        initial[c.name] = persona[c.name] ?? "";
      });
      if (mostrarEstado) initial.estado = persona.estado ?? 1;
      setForm(initial);
    }
  }, [persona, campos, mostrarEstado]);

  if (!persona) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "estado" ? Number(value) : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...persona, ...form });
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
                  {campos.map(campo => (
                    <div key={campo.name}>
                      <label className="block text-gray-300 text-sm mb-1">{campo.label}</label>
                      <input
                        className={inputClass(mode === "edit" && campo.editable)}
                        name={campo.name}
                        value={form[campo.name]}
                        onChange={handleChange}
                        disabled={mode === "view" || !campo.editable}
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

                {/* Nueva sección para mostrar vehículos registrados */}
                {Array.isArray(persona.vehiculos) && persona.vehiculos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-2">Vehículos registrados</h3>
                    <ul className="space-y-2">
                      {persona.vehiculos.map(v => (
                        <li key={v.id} className="bg-gray-800 rounded p-3 text-white flex flex-col">
                          <span><b>Placa:</b> {v.placa}</span>
                          <span><b>Marca:</b> {v.marca}</span>
                          <span><b>Modelo:</b> {v.modelo}</span>
                          <span><b>Tipo:</b> {v.tipo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}