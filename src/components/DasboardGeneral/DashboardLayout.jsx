import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardAppBar from './DashboardAppBar';

const DashboardLayout = ({ user, children, onLogout, onProfile, onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;