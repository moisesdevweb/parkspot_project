import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  DocumentChartBarIcon,
  Squares2X2Icon // <-- nuevo icono para Estacionamiento
} from '@heroicons/react/24/outline';

// Ítems base para todos
const navItemsBase = [
  { label: 'Inicio', path: '/dashboard/home', icon: HomeIcon, roles: ['ROLE_ADMIN','ROLE_VIGILANTE','ROLE_CLIENTE'] },
  { label: 'Perfil', path: '/dashboard/profile', icon: UserCircleIcon, roles: ['ROLE_ADMIN','ROLE_VIGILANTE','ROLE_CLIENTE'] },
];

// Ítem de Estacionamiento (Admin/Vigilante)
const estacionamientoItems = [
  { label: 'Estacionamiento', path: '/dashboard/espacios', icon: Squares2X2Icon, roles: ['ROLE_ADMIN','ROLE_VIGILANTE'] },
];

// Ítems extra para admin y vigilante
const adminExtra = [
  { label: 'Gestionar Clientes', path: '/dashboard/gestionar-clientes', icon: UsersIcon, roles: ['ROLE_ADMIN','ROLE_VIGILANTE'] },
  { label: 'Gestionar Vigilantes', path: '/dashboard/GestionarVigilantes', icon: ShieldCheckIcon, roles: ['ROLE_ADMIN'] },
];

// Ítems de reportes por rol
const reportesItems = [
  { label: 'Reportes', path: '/dashboard/reportes', icon: DocumentChartBarIcon, roles: ['ROLE_ADMIN'] },
  { label: 'Reportes', path: '/dashboard/reportes-vigilante', icon: DocumentChartBarIcon, roles: ['ROLE_VIGILANTE'] },
  { label: 'Mis Reportes', path: '/dashboard/reportes-cliente', icon: DocumentChartBarIcon, roles: ['ROLE_CLIENTE'] },
];

const Sidebar = ({ role, onNavigate, open, onClose, onLogout }) => {
  const location = useLocation();
  // Unifica ítems (inserta Estacionamiento después de Inicio/Perfil)
  const items = [
    ...navItemsBase,
    ...estacionamientoItems.filter(it => it.roles.includes(role)), // <-- agregado
    ...adminExtra.filter(it => it.roles.includes(role)),
    ...reportesItems.filter(it => it.roles.includes(role)),
  ];

  const active = (p) => location.pathname.toLowerCase().startsWith(p.toLowerCase());

  return (
    <aside
      className={`
        fixed z-50 top-0 left-0 h-full w-68 sm:w-64 flex flex-col
        bg-[#141a21]/95 border-r border-gray-800/70 backdrop-blur-md
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} 
        lg:static lg:translate-x-0
      `}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white tracking-tight shadow-lg">
            P
          </div>
          <span className="text-lg font-semibold text-gray-100">ParkSpot</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent px-3 py-4 space-y-6">
        <div className="space-y-1">
          {items
            .filter(it => it.roles.includes(role))
            .map(item => {
              const IconComp = item.icon;
              const isActive = active(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                    }`}
                >
                  {IconComp ? (
                    <IconComp className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  ) : (
                    <div className="w-5 h-5 rounded bg-gray-600/40" />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 uppercase tracking-wider">
            {role === 'ROLE_ADMIN' ? 'Administrador' :
             role === 'ROLE_VIGILANTE' ? 'Vigilante' : 'Cliente'}
          </span>
          <button
            onClick={() => {
              onClose?.();
              onLogout && onLogout();
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>

      {/* Close btn mobile */}
      <button
        onClick={onClose}
        className="absolute top-3 -right-10 lg:hidden bg-gray-800/80 hover:bg-gray-700 text-gray-200 w-9 h-9 rounded-lg shadow flex items-center justify-center"
      >
        ✕
      </button>
    </aside>
  );
};

export default Sidebar;