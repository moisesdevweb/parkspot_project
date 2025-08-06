// src/components/DasboardGeneral/DashboardLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardAppBar from './DashboardAppBar';

const DashboardLayout = ({ user, children, onLogout, onProfile, onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!user || !user.roles) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <span className="text-gray-500 text-lg">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar role={user.roles[0]} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col">
        <DashboardAppBar
          user={user}
          anchorEl={anchorEl}
          onMenuOpen={e => setAnchorEl(e.currentTarget)}
          onMenuClose={() => setAnchorEl(null)}
          onProfile={onProfile}
          onLogout={onLogout}
        />
        <main className="p-6 flex-1 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;