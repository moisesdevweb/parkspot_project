import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DasboardGeneral/DashboardLayout";
import TablaReportes from "../../components/Reportes/TablaReportes";
import ModalDetalleReporte from "../../components/Reportes/ModalDetalleReporte";
import Loader from "../../components/DasboardGeneral/Loader";
import { authFetch, getUser, clearAuth } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ReportesAdmin() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const user = getUser();
  const navigate = useNavigate();

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/reportes/todos");
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

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Reportes de Incidencias</h1>
        <p className="text-gray-300 mb-4">Administra y revisa todos los reportes de incidencias del sistema.</p>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <TablaReportes
          reportes={reportes}
          onVerDetalle={handleVerDetalle}
          modo="admin"
        />
      )}
      <ModalDetalleReporte
        open={modalDetalle}
        onClose={() => setModalDetalle(false)}
        reporte={reporteSeleccionado}
        modo="admin"
        onActualizado={fetchReportes}
      />
    </DashboardLayout>
  );
}