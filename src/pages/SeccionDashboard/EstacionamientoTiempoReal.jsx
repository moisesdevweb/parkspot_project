import React, { useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import { authFetch, clearAuth, getUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useEstacionamientoData from "../../hooks/useEstacionamientoData";
import EspacioCard from "../../components/Estacionamiento/EspacioCard";
import PanelClientesVehiculos from "../../components/Estacionamiento/PanelClientesVehiculos";
import ModalCrearReserva from "../../components/Estacionamiento/ModalCrearReserva";

export default function EstacionamientoTiempoReal() {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_ADMIN");
  const isVigilante = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_VIGILANTE");
  const isCliente = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_CLIENTE");

  const {
    espacios,
    regActivos,
    moverCliente,
    registrarEntrada,
    registrarSalida
  } = useEstacionamientoData();

  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSel, setClienteSel] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);

  // Estado para el modal de reserva
  const [modalReserva, setModalReserva] = useState({ open: false, espacio: null });

  // Función para abrir el modal
  const abrirModalReserva = (espacio) => setModalReserva({ open: true, espacio });
  const cerrarModalReserva = () => setModalReserva({ open: false, espacio: null });

  // Buscar clientes
  const buscarClientes = async (texto) => {
    setBusca(texto);
    if (!texto?.trim()) {
      setClientes([]);
      return;
    }
    try {
      const res = await authFetch(`/api/admin-cliente/buscar-clientes?nombre=${encodeURIComponent(texto)}`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      setClientes([]);
    }
  };

  // Seleccionar cliente y cargar vehículos
  const seleccionarCliente = async (cliente) => {
    setClienteSel(cliente);
    try {
      const res = await authFetch(`/api/admin-cliente/cliente/${cliente.id}/vehiculos`);
      const data = await res.json();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch {
      setVehiculos([]);
    }
  };

  // Mapa número de espacio -> etiqueta ocupante
  const ocupantesPorNumero = useMemo(() => {
    const mapa = new Map();
    regActivos.forEach(reg => {
      const ocupante = `${reg.vehiculoPlaca} - ${reg.clienteNombre}`;
      mapa.set(reg.numeroEspacio, ocupante);
    });
    return mapa;
  }, [regActivos]);

  // Drag & drop handler
  const onDragEnd = async ({ active, over }) => {
    if (!over || !active?.data?.current) return;

    const data = active.data.current;
    const espacioId = Number(String(over.id).replace("espacio-", ""));
    const espacio = espacios.find(e => e.id === espacioId);
    if (!espacio) return;

    // 1️⃣ DRAG DESDE PANEL (vehículo nuevo) → Solo VIGILANTES
    if (data.tipo === "vehiculo") {
      if (!isVigilante) {
        toast.error("Solo los vigilantes pueden asignar clientes nuevos a espacios de estacionamiento", {
          duration: 4000,
          icon: "🚫"
        });
        return;
      }

      if (espacio.estado !== "DISPONIBLE" && espacio.estado !== "RESERVADO") {
        toast.error(`El espacio ${espacio.numero} no está disponible`);
        return;
      }

      try {
        const r = await registrarEntrada({
          clienteId: data.clienteId,
          vehiculoId: data.vehiculoId,
          espacioId,
          observaciones: `Asignado por vigilante al espacio ${espacio.numero}`,
        });
        toast.success(r.message || "Entrada registrada");
      } catch (e) {
        toast.error(e.message);
      }
      return;
    }

    // 2️⃣ DRAG ENTRE ESPACIOS (reasignación) → Solo ADMINS
    if (data.tipo === "espacio-ocupado") {
      if (!isAdmin) {
        toast.error("Solo los administradores pueden reasignar vehículos entre espacios", {
          duration: 4000,
          icon: "🚫"
        });
        return;
      }

      if (espacio.estado !== "DISPONIBLE" && espacio.estado !== "RESERVADO") {
        toast.error(`El espacio ${espacio.numero} no está disponible para reasignación`);
        return;
      }

      // Encontrar el registro activo del espacio origen
      const espacioOrigen = espacios.find(e => e.id === data.espacioOrigenId);
      const regActivo = regActivos.find(r => r.numeroEspacio === espacioOrigen?.numero);

      if (!regActivo) {
        toast.error("No se encontró el registro activo para reasignar");
        return;
      }

      if (!window.confirm(`¿Reasignar vehículo ${regActivo.vehiculoPlaca} del espacio ${espacioOrigen.numero} al espacio ${espacio.numero}?`)) {
        return;
      }

      try {
        // ✅ USAR EL ENDPOINT DE MOVER CLIENTE (no salida + entrada)
        await moverCliente({
          registroId: regActivo.id,
          nuevoEspacioId: espacio.id,
          motivo: `Reasignación por administrador desde espacio ${espacioOrigen.numero}`,
        });
        toast.success(`Vehículo reasignado exitosamente al espacio ${espacio.numero}`);
      } catch (e) {
        toast.error(e.message || "Error al reasignar vehículo");
      }
      return;
    }
  };

  // Click en espacio ocupado -> salida (solo vigilante)
  const onClickEspacio = async (espacio) => {
    if (espacio.estado !== "OCUPADO") return;

    if (!isVigilante) {
      toast.error("Solo los vigilantes pueden registrar la salida de vehículos", {
        duration: 4000,
        icon: "🚫"
      });
      return;
    }

    const reg = regActivos.find(r => r.numeroEspacio === espacio.numero);
    if (!reg) return toast.error("No se encontró el registro activo para este espacio");
    if (!window.confirm(`¿Registrar salida del vehículo en ${espacio.numero}?`)) return;

    try {
      const r = await registrarSalida({
        registroId: reg.id,
        observaciones: `Salida confirmada desde grid ${espacio.numero}`,
      });
      toast.success(r.message || "Salida registrada");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Gestión de Estacionamiento</h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-300">
            {isVigilante ? (
              "Arrastra un vehículo a un espacio DISPONIBLE/RESERVADO. Clic en un espacio OCUPADO para registrar salida."
            ) : isAdmin ? (
              "Arrastra espacios OCUPADOS hacia espacios DISPONIBLES para reasignar vehículos. Vista de espacios de estacionamiento."
            ) : isCliente ? (
              "Haz clic en 'Reservar' para solicitar un espacio disponible. Solo puedes visualizar el estado de los espacios."
            ) : (
              "Vista de espacios de estacionamiento. Acceso de solo lectura."
            )}
          </p>
        </div>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {/* Columna izquierda: grid */}
          <div className={isCliente ? "w-full" : "flex-1"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {espacios.length === 0 ? (
                <div className="col-span-full text-gray-400 flex items-center gap-3">
                  <span>No hay espacios para mostrar.</span>
                  {isAdmin && (
                    <span className="text-blue-400">
                      Dirígete a <strong>"Gestionar Espacios"</strong> para crear tu primer espacio.
                    </span>
                  )}
                </div>
              ) : (
                espacios.map(e => (
                  <div key={e.id} className="relative">
                    <EspacioCard
                      espacio={e}
                      ocupadoPor={ocupantesPorNumero.get(e.numero)}
                      onClick={onClickEspacio}
                    />
                    {/* Botón reservar solo para cliente y espacio disponible */}
                    {isCliente && e.estado === "DISPONIBLE" && (
                      <button
                        className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs shadow hover:bg-blue-700"
                        onClick={() => abrirModalReserva(e)}
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Columna derecha: panel docked - Solo para vigilantes */}
          {(isVigilante || isAdmin) && (
            <div className="w-[22rem] shrink-0">
              <PanelClientesVehiculos
                busca={busca}
                onBuscar={buscarClientes}
                clientes={clientes}
                clienteSel={clienteSel}
                onSeleccionarCliente={seleccionarCliente}
                vehiculos={vehiculos}
              />
            </div>
          )}
        </div>
      </DndContext>

      {/* Modal de reserva */}
      <ModalCrearReserva
        open={modalReserva.open}
        onClose={cerrarModalReserva}
        espacio={modalReserva.espacio}
        onReservaCreada={cerrarModalReserva}
      />
    </DashboardLayout>
  );
}