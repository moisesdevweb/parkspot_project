import React, { useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import { authFetch, clearAuth, getUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useEstacionamientoData from "../../hooks/useEstacionamientoData";
import EspacioCard from "../../components/Estacionamiento/EspacioCard";
import PanelClientesVehiculos from "../../components/Estacionamiento/PanelClientesVehiculos";
import CrearEspacioModal from "../../components/Estacionamiento/CrearEspacioModal";

export default function EstacionamientoTiempoReal() {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_ADMIN");

  const {
    espacios,
    regActivos,
    fetchEspacios,
    registrarEntrada,
    registrarSalida
  } = useEstacionamientoData();

  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSel, setClienteSel] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [showCrear, setShowCrear] = useState(false);

  // Buscar clientes (igual que en GestionarClientes)
  const buscarClientes = async (texto) => {
    setBusca(texto);
    if (!texto?.trim()) {
      setClientes([]);
      return;
    }
    try {
      const res = await authFetch(`/api/persona/buscar-clientes?nombre=${encodeURIComponent(texto)}`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      setClientes([]);
    }
  };

  // Seleccionar cliente y cargar vehículos (igual que en ModalCrearReporte)
  const seleccionarCliente = async (cliente) => {
    setClienteSel(cliente);
    try {
      const res = await authFetch(`/api/reportes/vehiculos-cliente/${cliente.id}`);
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

  // Drop de vehículo en espacio
  const onDragEnd = async ({ active, over }) => {
    if (!over || !active?.data?.current) return;
    const data = active.data.current;
    if (data.tipo !== "vehiculo") return;

    const espacioId = Number(String(over.id).replace("espacio-", ""));
    const espacio = espacios.find(e => e.id === espacioId);
    if (!espacio) return;
    if (espacio.estado !== "DISPONIBLE" && espacio.estado !== "RESERVADO") {
      toast.error(`El espacio ${espacio.numero} no está disponible`);
      return;
    }
    try {
      const r = await registrarEntrada({
        clienteId: data.clienteId,
        vehiculoId: data.vehiculoId,
        espacioId,
        observaciones: `Asignado por DnD al espacio ${espacio.numero}`,
      });
      toast.success(r.message || "Entrada registrada");
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Click en espacio ocupado -> salida
  const onClickEspacio = async (espacio) => {
    if (espacio.estado !== "OCUPADO") return;
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
            Arrastra un vehículo a un espacio DISPONIBLE/RESERVADO. Clic en un espacio OCUPADO para registrar salida.
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCrear(true)}
              className="px-3 py-1.5 rounded bg-blue-700 text-white text-sm hover:bg-blue-800"
            >
              Nuevo espacio
            </button>
          )}
        </div>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {/* Columna izquierda: grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {espacios.length === 0 ? (
                <div className="col-span-full text-gray-400 flex items-center gap-3">
                  <span>No hay espacios para mostrar.</span>
                  {isAdmin && (
                    <button
                      onClick={() => setShowCrear(true)}
                      className="px-3 py-1.5 rounded bg-blue-700 text-white text-sm hover:bg-blue-800"
                    >
                      Crear tu primer espacio
                    </button>
                  )}
                </div>
              ) : (
                espacios.map(e => (
                  <EspacioCard
                    key={e.id}
                    espacio={e}
                    ocupadoPor={ocupantesPorNumero.get(e.numero)}
                    onClick={onClickEspacio}
                  />
                ))
              )}
            </div>
          </div>

          {/* Columna derecha: panel docked */}
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
        </div>
      </DndContext>

      {showCrear && (
        <CrearEspacioModal
          open={showCrear}
          onClose={() => setShowCrear(false)}
          onCreated={fetchEspacios}
        />
      )}
    </DashboardLayout>
  );
}