// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import AdminVigilanteDashboard from './pages/Dashboard/AdminVigilanteDashboard';
import ClientDashboard from './pages/Dashboard/ClientDashboard';
import Reservas from './pages/Reservas';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirige a /login cuando accedas a la ruta raíz */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
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

        {/* Página de reservas */}
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </Router>
  );
}

export default App;
