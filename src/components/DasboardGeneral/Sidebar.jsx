import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ role, onNavigate }) => (
  <div className="bg-[#23272f] h-full w-64 p-4 shadow-2xl rounded-tr-3xl rounded-br-3xl flex flex-col">
    <div className="mb-8 flex items-center gap-2 px-2">
      <img src="/logo192.png" alt="Logo" className="w-10 h-10 rounded-full shadow" />
      <span className="text-white text-xl font-bold tracking-wide">ParkSpot</span>
    </div>
    <List>
      <ListItem
        button
        onClick={() => onNavigate('/dashboard/home')}
        className="group rounded-lg mb-2 transition-all duration-200 hover:bg-blue-600/80 hover:scale-105"
      >
        <ListItemIcon>
          <DashboardIcon className="text-blue-300 group-hover:text-white transition" fontSize="large" />
        </ListItemIcon>
        <ListItemText primary="Inicio" primaryTypographyProps={{ className: 'text-white font-medium' }} />
      </ListItem>
      <ListItem
        button
        onClick={() => onNavigate('/dashboard/profile')}
        className="group rounded-lg mb-2 transition-all duration-200 hover:bg-blue-600/80 hover:scale-105"
      >
        <ListItemIcon>
          <PersonIcon className="text-blue-300 group-hover:text-white transition" fontSize="large" />
        </ListItemIcon>
        <ListItemText primary="Perfil" primaryTypographyProps={{ className: 'text-white font-medium' }} />
      </ListItem>
      {(role === 'ROLE_ADMIN' || role === 'ROLE_VIGILANTE') && (
        <>
          <Divider className="my-4 bg-blue-400/30" />
          <div className="px-4 pb-2 text-blue-200 text-xs tracking-widest uppercase">Administración</div>
          <ListItem
            button
            onClick={() => onNavigate('/dashboard/gestionar-clientes')}
            className="group rounded-lg mb-2 transition-all duration-200 hover:bg-blue-600/80 hover:scale-105"
          >
            <ListItemIcon>
              <PersonIcon className="text-blue-300 group-hover:text-white transition" fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Gestionar Clientes" primaryTypographyProps={{ className: 'text-white font-medium' }} />
          </ListItem>
          {role === 'ROLE_ADMIN' && (
            <ListItem
              button
              onClick={() => onNavigate('/dashboard/GestionarVigilantes')}
              className="group rounded-lg mb-2 transition-all duration-200 hover:bg-blue-600/80 hover:scale-105"
            >
              <ListItemIcon>
                <PersonIcon className="text-blue-300 group-hover:text-white transition" fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Gestionar Vigilantes" primaryTypographyProps={{ className: 'text-white font-medium' }} />
            </ListItem>
          )}
        </>
      )}
      <div className="flex-grow" />
      <Divider className="my-4 bg-blue-400/30" />
      
    </List>
  </div>
);

export default Sidebar;