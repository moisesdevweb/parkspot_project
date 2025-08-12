import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import UserTable from "../../components/DasboardGeneral/UserTable";
import ModalPersona from "../../components/Modal/ModalPersona";
import BuscadorPersona from "../../components/DasboardGeneral/BuscadorPersona";
import Loader from "../../components/DasboardGeneral/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const camposVigilante = [
  { name: "username", label: "Usuario", editable: false },
  { name: "dni", label: "DNI", editable: true },
  { name: "nombreCompleto", label: "Nombre Completo", editable: true },
  { name: "apellidos", label: "Apellidos", editable: true },
  { name: "direccion", label: "Dirección", editable: true },
  { name: "telefono", label: "Teléfono", editable: true },
  { name: "email", label: "Email", editable: true },
];

export default function GestionarVigilantes() {
  const [vigilantes, setVigilantes] = useState([]);
  const [loadingInicial, setLoadingInicial] = useState(true); // solo para la primera carga
  const [modalOpen, setModalOpen] = useState(false);
  const [vigilanteSeleccionado, setVigilanteSeleccionado] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Carga inicial y para limpiar búsqueda
  const fetchVigilantes = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/persona/listar-vigilantes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener vigilantes");
      const data = await res.json();
      setVigilantes(data);
    } catch {
      toast.error("No se pudieron cargar los vigilantes");
    }
    setLoadingInicial(false);
  };

  useEffect(() => {
    fetchVigilantes();
  }, []);

  // Búsqueda dinámica
  const buscarVigilantes = async (nombre) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/persona/buscar-vigilantes?nombre=${encodeURIComponent(nombre)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("No se pudo buscar vigilantes");
      const data = await res.json();
      setVigilantes(data);
    } catch {
      toast.error("Error al buscar vigilantes");
    }
    // No cambies loadingInicial aquí
  };

  const handleEdit = (vigilante) => {
    setVigilanteSeleccionado(vigilante);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleView = (vigilante) => {
    setVigilanteSeleccionado(vigilante);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSave = async (nuevoVigilante) => {
    try {
      // 1. Actualiza datos personales (incluye email y dni)
      const resDatos = await fetch(
        `http://localhost:8080/api/persona/vigilante/${nuevoVigilante.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: nuevoVigilante.email,
            nombreCompleto: nuevoVigilante.nombreCompleto,
            apellidos: nuevoVigilante.apellidos,
            dni: nuevoVigilante.dni,
            direccion: nuevoVigilante.direccion,
            telefono: nuevoVigilante.telefono,
          }),
        }
      );
      if (!resDatos.ok) {
        const error = await resDatos.json();
        throw new Error(error.message || "Error al actualizar datos del vigilante");
      }

      // 2. Actualiza el estado
      const resEstado = await fetch(
        `http://localhost:8080/api/persona/vigilante/estado/${nuevoVigilante.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            estado: nuevoVigilante.estado,
          }),
        }
      );
      if (!resEstado.ok) throw new Error("Error al actualizar el estado del vigilante");

      toast.success("Vigilante actualizado");
      setVigilantes((prev) =>
        prev.map((v) => (v.id === nuevoVigilante.id ? { ...v, ...nuevoVigilante } : v))
      );
    } catch (err) {
      toast.error(err.message || "No se pudo actualizar el vigilante");
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { localStorage.clear(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lista de Vigilantes</h1>
        <p className="text-gray-300 mb-4">Aquí puedes ver todos los vigilantes registrados en el sistema.</p>
      </div>
      {loadingInicial ? (
        <Loader />
      ) : (
        <>
          <BuscadorPersona
            onBuscar={buscarVigilantes}
            onLimpiar={fetchVigilantes}
            placeholder="Buscar vigilante por nombre..."
          />
          <UserTable users={vigilantes} onEdit={handleEdit} onView={handleView} />
          <ModalPersona
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            persona={vigilanteSeleccionado}
            onSave={handleSave}
            mode={modalMode}
            campos={camposVigilante}
            titulo={modalMode === "edit" ? "Editar Vigilante" : "Ver Vigilante"}
            mostrarEstado={true}
          />
        </>
      )}
    </DashboardLayout>
  );
}