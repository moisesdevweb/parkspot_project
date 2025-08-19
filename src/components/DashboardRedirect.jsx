import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/api';

const DashboardRedirect = () => {
  const user = getUser();
  
  if (!user || !user.roles) {
    return <Navigate to="/login" />;
  }

  const isCliente = (user.roles || []).some(r => (r?.name ?? r) === "ROLE_CLIENTE");
  
  if (isCliente) {
    return <Navigate to="/dashboard/cliente-estadisticas" />;
  } else {
    return <Navigate to="/dashboard/estadisticas" />;
  }
};

export default DashboardRedirect;
