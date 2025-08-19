import React from 'react';

export default function LeyendaEstados() {
  const estados = [
    { 
      estado: 'DISPONIBLE', 
      color: '#22C55E', 
      icono: '✅', 
      descripcion: 'Disponible' 
    },
    { 
      estado: 'OCUPADO', 
      color: '#EF4444', 
      icono: '🚗', 
      descripcion: 'Ocupado' 
    },
    { 
      estado: 'RESERVADO', 
      color: '#F59E0B', 
      icono: '📅', 
      descripcion: 'Reservado' 
    },
    { 
      estado: 'MANTENIMIENTO', 
      color: '#8B5CF6', 
      icono: '🔧', 
      descripcion: 'Mantenimiento' 
    }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <h3 className="text-white font-semibold text-sm mb-2">Estado de Espacios</h3>
      <div className="space-y-1">
        {estados.map((item) => (
          <div key={item.estado} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-white/30"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.icono}</span>
            <span className="text-white text-xs">{item.descripcion}</span>
          </div>
        ))}
      </div>
      
      {/* Tipos de espacio */}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <h4 className="text-white font-semibold text-xs mb-1">Tipos</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">🚗</span>
            <span className="text-white text-xs">Carro</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🏍️</span>
            <span className="text-white text-xs">Moto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">♿</span>
            <span className="text-white text-xs">Discapacitado</span>
          </div>
        </div>
      </div>
    </div>
  );
}