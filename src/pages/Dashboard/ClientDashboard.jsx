// src/pages/Dashboard/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DasboardGeneral/DashboardLayout';
import { getUser, clearAuth } from '../../utils/api';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userObj = getUser();
    if (userObj) {
      setUser(userObj);
      const roles = userObj.roles || [];
      if (!roles.includes('ROLE_CLIENTE')) {
        navigate('/dashboard/admin');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2>Cargando...</h2>
      </div>
    );
  }

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      onProfile={() => navigate('/profile')}
      onNavigate={ruta => {
        if (ruta === '/logout') handleLogout();
        else navigate(ruta);
      }}
    >
      <h2>Bienvenido, {user.username}</h2>
      <p>Aquí va el contenido específico para el cliente.</p>
      <div className="mt-6">
        <button
          className="w-full py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/reservas')}
        >
          Reservar Estacionamiento
        </button>
      </div>
    </DashboardLayout>
  );
}

export default ClientDashboard;
