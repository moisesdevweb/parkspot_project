import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import UserTable from "../../components/DasboardGeneral/UserTable";
import ModalPersona from "../../components/Modal/ModalPersona";
import ModalRegistrarPersona from "../../components/Modal/ModalRegistrarCliente";
import BuscadorPersona from "../../components/DasboardGeneral/BuscadorPersona";
import Loader from "../../components/DasboardGeneral/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/persona/listar-clientes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setClientes(data);
    } catch {
      toast.error("No se pudieron cargar los clientes");
    }
    setLoadingInicial(false); // solo aquí
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
      // Actualiza datos personales
      const resDatos = await fetch(
        `http://localhost:8080/api/persona/cliente/${nuevoCliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: nuevoCliente.email,
            nombreCompleto: nuevoCliente.nombreCompleto,
            apellidos: nuevoCliente.apellidos,
            dni: nuevoCliente.dni,
            direccion: nuevoCliente.direccion,
            telefono: nuevoCliente.telefono,
          }),
        }
      );
      if (!resDatos.ok) {
        const error = await resDatos.json();
        throw new Error(error.message || "Error al actualizar datos del cliente");
      }

      // Actualiza el estado
      const resEstado = await fetch(
        `http://localhost:8080/api/persona/cliente/estado/${nuevoCliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            estado: nuevoCliente.estado,
          }),
        }
      );
      if (!resEstado.ok) throw new Error("Error al actualizar el estado del cliente");

      toast.success("Cliente actualizado");
      setClientes((prev) =>
        prev.map((c) => (c.id === nuevoCliente.id ? { ...c, ...nuevoCliente } : c))
      );
    } catch (err) {
      toast.error(err.message || "No se pudo actualizar el cliente");
    }
    setModalOpen(false);
  };

  const buscarClientes = async (nombre) => {
    try {
      const res = await fetch(`http://localhost:8080/api/persona/buscar-clientes?nombre=${encodeURIComponent(nombre)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
      onLogout={() => { localStorage.clear(); navigate("/login"); }}
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
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
          onClick={() => setModalRegistrarOpen(true)}
        >
          Agregar Cliente
        </button>
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