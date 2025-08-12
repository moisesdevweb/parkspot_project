// src/components/DasboardGeneral/DashboardLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardAppBar from './DashboardAppBar';

const DashboardLayout = ({ user, children, onLogout, onProfile, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !user.roles) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0e1217]">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0e1217] text-gray-100">
      {/* Sidebar Mobile Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition ${sidebarOpen ? 'bg-black/50 backdrop-blur-sm' : 'pointer-events-none opacity-0'}`}
           onClick={() => setSidebarOpen(false)} />
      <Sidebar
        role={user.roles[0]}
        onNavigate={(path) => {
          setSidebarOpen(false);
          onNavigate(path);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}   // <--- añadido
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardAppBar
          user={user}
          onProfile={onProfile}
          onLogout={onLogout}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onNavigate={onNavigate}   // <--- añadido
        />
        <main className="flex-1 overflow-auto px-5 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;