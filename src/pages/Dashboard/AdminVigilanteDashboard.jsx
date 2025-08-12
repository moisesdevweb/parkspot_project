// src/pages/Dashboard/AdminVigilanteDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DasboardGeneral/DashboardLayout';
import { getUser, clearAuth } from '../../utils/api';

function AdminVigilanteDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userObj = getUser();
    if (userObj) {
      setUser(userObj);
      const roles = userObj.roles || [];
      if (!roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_VIGILANTE')) {
        navigate('/dashboard/cliente');
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
      onProfile={() => navigate('/dashboard/profile')}
      onNavigate={(ruta) => {
        if (ruta === '/logout') handleLogout();
        else navigate(ruta);
      }}
    >
      <h2>Bienvenido, {user.username}</h2>
      <p>Aquí va el contenido para admin/vigilante.</p>
    </DashboardLayout>
  );
}

export default AdminVigilanteDashboard;
