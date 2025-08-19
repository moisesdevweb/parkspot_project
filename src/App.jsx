// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';
import AdminVigilanteDashboard from './pages/Dashboard/AdminVigilanteDashboard';
import ClientDashboard from './pages/Dashboard/ClientDashboard';
import Reservas from './pages/Reservas';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/Dashboard/ProfilePage';
import GestionarVigilantes from './pages/SeccionDashboard/GestionarVigilantes';
import GestionarClientes from './pages/SeccionDashboard/GestionarClientes';
import ReportesAdmin from './pages/Reportes/ReportesAdmin';
import ReportesVigilante from './pages/Reportes/ReportesVigilante';
import ReportesCliente from './pages/Reportes/ReportesCliente';
import EstacionamientoTiempoReal from "./pages/SeccionDashboard/EstacionamientoTiempoReal";
import GestionEspacios from "./pages/SeccionDashboard/GestionEspacios"; // ✅ NUEVO
import GestionarReservas from './pages/SeccionDashboard/GestionarReservas';
import DashboardEstadisticas from './pages/SeccionDashboard/DashboardEstadisticas';
import DashboardCliente from './pages/SeccionDashboard/DashboardCliente';
import DashboardRedirect from './components/DashboardRedirect';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Redirige a /login cuando accedas a la ruta raíz */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard/home" element={
          <PrivateRoute>
            <DashboardRedirect />
          </PrivateRoute>
        } />
        <Route path="/dashboard/estadisticas" element={
          <PrivateRoute roles={["ROLE_ADMIN", "ROLE_VIGILANTE"]}>
            <DashboardEstadisticas />
          </PrivateRoute>
        } />
        <Route path="/dashboard/cliente-estadisticas" element={
          <PrivateRoute roles={["ROLE_CLIENTE"]}>
            <DashboardCliente />
          </PrivateRoute>
        } />
        <Route path="/dashboard/admin" element={
          <PrivateRoute>
            <AdminVigilanteDashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard/cliente" element={
          <PrivateRoute>
            <ClientDashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        
        {/* Gestión de usuarios */}
        <Route path="/dashboard/GestionarVigilantes" element={
          <PrivateRoute>
            <GestionarVigilantes />
          </PrivateRoute>
        } />
        <Route path="/dashboard/gestionar-clientes" element={
          <PrivateRoute>
            <GestionarClientes />
          </PrivateRoute>
        } />

        {/* Estacionamiento */}
        <Route path="/dashboard/estacionamiento" element={
          <PrivateRoute>
            <EstacionamientoTiempoReal />
          </PrivateRoute>
        } />
        <Route path="/dashboard/gestion-espacios" element={
          <PrivateRoute>
            <GestionEspacios />
          </PrivateRoute>
        } />

        {/* NUEVO: Reservas del cliente */}
        <Route path="/dashboard/reservas" element={
          <PrivateRoute>
            <Reservas />
          </PrivateRoute>
        } />
        {/* NUEVO: Gestión de reservas */}
        <Route path="/dashboard/gestionar-reservas" element={
          <PrivateRoute roles={["ROLE_ADMIN", "ROLE_VIGILANTE"]}>
            <GestionarReservas />
          </PrivateRoute>
        } />

        {/* Reportes */}
        <Route path="/dashboard/reportes" element={
          <PrivateRoute>
            <ReportesAdmin />
          </PrivateRoute>
        } />
        <Route path="/dashboard/reportes-vigilante" element={
          <PrivateRoute>
            <ReportesVigilante />
          </PrivateRoute>
        } />
        <Route path="/dashboard/reportes-cliente" element={
          <PrivateRoute>
            <ReportesCliente />
          </PrivateRoute>
        } />
        
        {/* Página de reservas (fuera del dashboard) */}
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </Router>
  );
}

export default App;
