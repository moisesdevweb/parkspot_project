// src/pages/Dashboard/AdminVigilanteDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DasboardGeneral/DashboardLayout';

function AdminVigilanteDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        // Si el usuario no es admin ni vigilante, redirige
        if (
          !userObj.roles.includes('ROLE_ADMIN') &&
          !userObj.roles.includes('ROLE_VIGILANTE')
        ) {
          navigate('/dashboard/cliente');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
