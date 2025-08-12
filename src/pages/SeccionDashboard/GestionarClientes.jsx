import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import UserTable from "../../components/DasboardGeneral/UserTable";
import ModalPersona from "../../components/Modal/ModalPersona";
import ModalRegistrarPersona from "../../components/Modal/ModalRegistrarCliente";
import BuscadorPersona from "../../components/DasboardGeneral/BuscadorPersona";
import Loader from "../../components/DasboardGeneral/Loader";
import Button from "../../components/Button"; // <-- Importa tu componente Button
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline"; // <-- Importa el ícono
import toast from "react-hot-toast";
import { authFetch, clearAuth, getUser } from "../../utils/api";

const camposCliente = [
  { name: "username", label: "Usuario", editable: false },
  { name: "dni", label: "DNI", editable: true },
  { name: "nombreCompleto", label: "Nombre Completo", editable: true },
  { name: "apellidos", label: "Apellidos", editable: true },
  { name: "direccion", label: "Dirección", editable: true },
  { name: "telefono", label: "Teléfono", editable: true },
  { name: "email", label: "Email", editable: true },
];

export default function GestionarClientes() {
  const [clientes, setClientes] = useState([]);
  const [loadingInicial, setLoadingInicial] = useState(true); // solo para la primera carga
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const user = getUser();
  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const res = await authFetch("/api/persona/listar-clientes");
      const data = await res.json();
      setClientes(data);
    } catch {
      toast.error("No se pudieron cargar los clientes");
    }
    setLoadingInicial(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleView = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSave = async (nuevoCliente) => {
    try {
      const res = await authFetch(`/api/persona/cliente-completo/${nuevoCliente.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: nuevoCliente.email,
          nombreCompleto: nuevoCliente.nombreCompleto,
          apellidos: nuevoCliente.apellidos,
          dni: nuevoCliente.dni,
          direccion: nuevoCliente.direccion,
          telefono: nuevoCliente.telefono,
          estado: nuevoCliente.estado,
          vehiculos: nuevoCliente.vehiculos,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar datos del cliente");
      }

      toast.success("Cliente actualizado");
      setClientes((prev) =>
        prev.map((c) => (c.id === nuevoCliente.id ? { ...c, ...nuevoCliente } : c))
      );
      setModalOpen(false); // <-- Esto cierra el modal después de guardar
    } catch (err) {
      toast.error(err.message || "No se pudo actualizar el cliente");
    }
  };

  const buscarClientes = async (nombre) => {
    try {
      const res = await authFetch(`/api/persona/buscar-clientes?nombre=${encodeURIComponent(nombre)}`);
      const data = await res.json();
      setClientes(data);
    } catch {
      toast.error("Error al buscar clientes");
    }
    // NO cambies loadingInicial aquí
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lista de Clientes</h1>
        <p className="text-gray-300 mb-4">Aquí puedes ver y editar los clientes registrados.</p>
      </div>
      {/* Buscador y botón en la misma línea */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <BuscadorPersona
            onBuscar={buscarClientes}
            onLimpiar={fetchClientes}
            placeholder="Buscar cliente por nombre..."
          />
        </div>
        <Button
          variant="success"
          size="md"
          icon={<PlusIcon className="w-4 h-4" />}
          onClick={() => setModalRegistrarOpen(true)}
        >
          Agregar Cliente
        </Button>
      </div>
      {loadingInicial ? (
        <Loader />
      ) : (
        <>
          <UserTable users={clientes} onEdit={handleEdit} onView={handleView} />
          <ModalPersona
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            persona={clienteSeleccionado}
            onSave={handleSave}
            mode={modalMode}
            campos={camposCliente}
            titulo={modalMode === "edit" ? "Editar Cliente" : "Ver Cliente"}
            mostrarEstado={true}
            mostrarVehiculos={true} // <--- SOLO AQUÍ
          />
        </>
      )}
      {/* Modal para registrar cliente */}
      <ModalRegistrarPersona
        open={modalRegistrarOpen}
        onClose={() => setModalRegistrarOpen(false)}
        onRegistrado={fetchClientes}
      />
    </DashboardLayout>
  );
}