import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import UserTable from "../../components/DasboardGeneral/UserTable";
import ModalPersona from "../../components/Modal/ModalPersona";
import BuscadorPersona from "../../components/DasboardGeneral/BuscadorPersona";
import Loader from "../../components/DasboardGeneral/Loader";
import Button from "../../components/Button";
import ModalRegistrarVigilante from "../../components/Modal/ModalRegistrarVigilante";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authFetch, clearAuth, getUser } from "../../utils/api";
import { PlusIcon } from "@heroicons/react/24/outline";

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
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);
  const [vigilanteSeleccionado, setVigilanteSeleccionado] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const user = getUser();
  const navigate = useNavigate();

  const fetchVigilantes = async () => {
    try {
      const res = await authFetch("/api/persona/listar-vigilantes");
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

  const buscarVigilantes = async (nombre) => {
    try {
      const res = await authFetch(`/api/persona/buscar-vigilantes?nombre=${encodeURIComponent(nombre)}`);
      if (!res.ok) throw new Error("No se pudo buscar vigilantes");
      const data = await res.json();
      setVigilantes(data);
    } catch {
      toast.error("Error al buscar vigilantes");
    }
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
      const resDatos = await authFetch(`/api/persona/vigilante/${nuevoVigilante.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: nuevoVigilante.email,
          nombreCompleto: nuevoVigilante.nombreCompleto,
          apellidos: nuevoVigilante.apellidos,
          dni: nuevoVigilante.dni,
          direccion: nuevoVigilante.direccion,
          telefono: nuevoVigilante.telefono,
        }),
      });
      if (!resDatos.ok) {
        const error = await resDatos.json();
        throw new Error(error.message || "Error al actualizar datos del vigilante");
      }

      const resEstado = await authFetch(`/api/persona/vigilante/estado/${nuevoVigilante.id}`, {
        method: "PUT",
        body: JSON.stringify({
          estado: nuevoVigilante.estado,
        }),
      });
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
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Lista de Vigilantes</h1>
        <p className="text-gray-300 mb-4">Aquí puedes ver y editar los vigilantes registrados.</p>
      </div>
      {/* Buscador y botón en la misma línea */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <BuscadorPersona
            onBuscar={buscarVigilantes}
            onLimpiar={fetchVigilantes}
            placeholder="Buscar vigilante por nombre..."
          />
        </div>
        {/* Solo el admin puede agregar vigilantes */}
        {user?.roles?.includes("ROLE_ADMIN") && (
          <Button
            variant="success"
            size="md"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setModalRegistrarOpen(true)}
          >
            Agregar Vigilante
          </Button>
        )}
      </div>
      {loadingInicial ? (
        <Loader />
      ) : (
        <>
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
            mostrarVehiculos={false} // <--- OCULTAR EN VIGILANTE
          />
        </>
      )}
      {/* Modal para registrar vigilante */}
      <ModalRegistrarVigilante
        open={modalRegistrarOpen}
        onClose={() => setModalRegistrarOpen(false)}
        onRegistrado={fetchVigilantes}
      />
    </DashboardLayout>
  );
}