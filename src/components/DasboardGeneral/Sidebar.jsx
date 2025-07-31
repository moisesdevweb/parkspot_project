import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ role, onNavigate }) => (
  <div className="bg-gray-800 h-full w-60 p-4">
    <List>
      <ListItem button onClick={() => onNavigate('/dashboard/home')}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItem>
      <ListItem button onClick={() => onNavigate('/dashboard/profile')}>
        <ListItemIcon><PersonIcon /></ListItemIcon>
        <ListItemText primary="Perfil" />
      </ListItem>
      {/* Sección solo para admin/vigilante */}
      {(role === 'ROLE_ADMIN' || role === 'ROLE_VIGILANTE') && (
        <ListItem button onClick={() => onNavigate('/dashboard/usuarios')}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Gestionar Usuarios" />
        </ListItem>
      )}
      <ListItem button onClick={() => onNavigate('/logout')}>
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItem>
    </List>
  </div>
);

export default Sidebar;