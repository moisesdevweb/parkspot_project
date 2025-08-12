import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import TablaReportes from "../../components/Reportes/TablaReportes";
import ModalDetalleReporte from "../../components/Reportes/ModalDetalleReporte";
import ModalCrearReporte from "../../components/Reportes/ModalCrearReporte";
import ModalSubirImagenes from "../../components/Reportes/ModalSubirImagenes";
import Loader from "../../components/DasboardGeneral/Loader";
import { authFetch, getUser, clearAuth } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ReportesVigilante() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalImagen, setModalImagen] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const user = getUser();
  const navigate = useNavigate();

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/reportes/mis-reportes");
      const data = await res.json();
      setReportes(data);
    } catch {
      toast.error("No se pudieron cargar los reportes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleVerDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
    setModalDetalle(true);
  };

  const handleSubirImagen = (reporte) => {
    setReporteSeleccionado(reporte);
    setModalImagen(true);
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Mis Reportes de Incidencia</h1>
        <p className="text-gray-300 mb-4">Aquí puedes ver, crear y gestionar tus reportes de incidencias.</p>
      </div>
      <div className="flex justify-end mb-4">
        <Button
          variant="success"
          size="md"
          icon={<PlusIcon className="w-4 h-4" />}
          onClick={() => setModalCrear(true)}
        >
          Nuevo Reporte
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <TablaReportes
          reportes={reportes}
          onVerDetalle={handleVerDetalle}
          modo="vigilante"
          onSubirImagen={handleSubirImagen}
        />
      )}
      {/* Modal para ver detalle */}
      <ModalDetalleReporte
        open={modalDetalle}
        onClose={() => setModalDetalle(false)}
        reporte={reporteSeleccionado}
        modo="vigilante"
        onActualizado={fetchReportes}
      />
      {/* Modal para crear reporte */}
      <ModalCrearReporte
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onCreado={fetchReportes}
      />
      {/* Modal para subir imágenes */}
      <ModalSubirImagenes
        open={modalImagen}
        onClose={() => setModalImagen(false)}
        reporte={reporteSeleccionado}
        onSubido={fetchReportes}
      />
    </DashboardLayout>
  );
}