import React, { useState, useRef, useEffect } from 'react';
import { Bars3Icon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const DashboardAppBar = ({ user, onProfile, onLogout, onMenuToggle, onNavigate }) => {
  const [open, setOpen] = useState(false);          // dropdown usuario
  const ref = useRef(null);

  // Estado buscador
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(-1);
  const searchRef = useRef(null);

  // Cerrar dropdown al hacer click fuera (usuario y buscador)
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const normalize = (s = '') =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const getOptions = (role) => {
    const base = [
      { label: 'Perfil', path: '/dashboard/profile', keywords: ['cuenta', 'usuario', 'pe'] },
    ];

    if (role === 'ROLE_ADMIN') {
      return [
        { label: 'Inicio', path: '/dashboard', keywords: ['home', 'principal'] },
        ...base,
        { label: 'Gestionar Clientes', path: '/dashboard/gestionar-clientes', keywords: ['gestionar', 'clientes'] },
        { label: 'Gestionar Vigilantes', path: '/dashboard/GestionarVigilantes', keywords: ['gestionar', 'vigilantes'] },
        { label: 'Estacionamiento', path: '/dashboard/espacios', keywords: ['estacionamiento', 'espacios', 'tiempo', 'real'] },
        { label: 'Gestionar Espacios', path: '/dashboard/gestionar-espacios', keywords: ['gestionar', 'espacios', 'cocheras', 'crear', 'editar'] },
        { label: 'Reportes', path: '/dashboard/reportes', keywords: ['estadísticas', 'incidencias', 'reportes'] },
        { label: 'Configuración', path: '/dashboard/configuracion', keywords: ['ajustes', 'settings'] },
      ];
    }
    if (role === 'ROLE_VIGILANTE') {
      return [
        { label: 'Inicio', path: '/dashboard', keywords: ['home', 'principal'] },
        ...base,
        { label: 'Gestionar Clientes', path: '/dashboard/gestionar-clientes', keywords: ['gestionar', 'clientes'] },
        { label: 'Estacionamiento', path: '/dashboard/espacios', keywords: ['estacionamiento', 'espacios', 'tiempo', 'real'] },
        { label: 'Reportes', path: '/dashboard/reportes-vigilante', keywords: ['estadísticas', 'incidencias', 'reportes'] },
      ];
    }
    // ROLE_CLIENTE
    return [
      { label: 'Inicio', path: '/dashboard', keywords: ['home', 'principal'] },
      ...base,
      { label: 'Mis Reservas', path: '/dashboard/mis-reservas', keywords: ['reservas', 'historial'] },
    ];
  };

  const all = getOptions(user?.roles?.[0] || 'ROLE_CLIENTE');
  const results = q
    ? all.filter(it => normalize(`${it.label} ${it.keywords?.join(' ')}`).includes(normalize(q)))
    : [];

  const go = (item) => {
    if (!item) return;
    onNavigate && onNavigate(item.path);
    setShow(false);
    setQ('');
    setIdx(-1);
  };

  const onKey = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => (i + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => (i - 1 + results.length) % results.length); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[idx >= 0 ? idx : 0]); }
    else if (e.key === 'Escape') { setShow(false); }
  };

  return (
    <header className="h-16 border-b border-gray-800/70 bg-[#141a21]/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Botón menú (móvil) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/70 hover:bg-gray-700 text-gray-300 transition"
        aria-label="Abrir menú"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Búsqueda con sugerencias */}
      <div ref={searchRef} className="flex-1 max-w-md hidden md:flex">
        <div className="w-full relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); setShow(true); setIdx(-1); }}
            onFocus={() => q && setShow(true)}
            onKeyDown={onKey}
            placeholder="Buscar (ej: pe → Perfil, gestionar → opciones de admin)…"
            className="w-full pl-11 pr-4 py-2 rounded-lg bg-gray-800/70 border border-gray-700/60 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />

          {show && results.length > 0 && (
            <div className="absolute mt-2 w-full bg-[#11161c] border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
              <ul className="max-h-72 overflow-auto py-1">
                {results.map((item, i) => (
                  <li key={item.path}>
                    <button
                      onMouseEnter={() => setIdx(i)}
                      onClick={() => go(item)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2
                        ${i === idx ? 'bg-blue-600/20 text-white' : 'text-gray-300 hover:bg-gray-700/40 hover:text-white'}`}
                    >
                      {item.label}
                      <span className="ml-auto text-[11px] text-gray-500">{item.path}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Usuario / Dropdown (derecha) */}
      <div ref={ref} className="relative ml-auto">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700/60 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-semibold">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs text-gray-400 -mb-0.5">Sesión</span>
            <span className="text-sm font-medium text-gray-100 truncate max-w-[110px]">
              {user?.username}
            </span>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-[#1b222b] border border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Rol</p>
              <p className="text-sm text-gray-200 font-medium">{user?.roles?.[0]?.replace('ROLE_', '')}</p>
            </div>
            <button
              onClick={() => { setOpen(false); onProfile(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/40 hover:text-white"
            >
              Editar Perfil
            </button>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardAppBar;