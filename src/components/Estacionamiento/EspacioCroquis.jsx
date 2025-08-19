// src/components/Estacionamiento/EspacioCroquis.jsx
import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export default function EspacioCroquis({ 
  espacio, 
  x, 
  y, 
  ocupadoPor, 
  onClick, 
  isCliente, 
  onReservar 
}) {
  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: `espacio-${espacio.id}`,
  });

  const { attributes, listeners, setNodeRef: dragRef } = useDraggable({
    id: `drag-espacio-${espacio.id}`,
    data: {
      tipo: "espacio-ocupado",
      espacioOrigenId: espacio.id,
    },
    disabled: espacio.estado !== "OCUPADO",
  });

  // Colores según estado
  const getColorEstado = () => {
    switch (espacio.estado) {
      case 'DISPONIBLE': return '#22C55E'; // Verde
      case 'OCUPADO': return '#EF4444';    // Rojo
      case 'RESERVADO': return '#F59E0B';  // Amarillo
      case 'MANTENIMIENTO': return '#8B5CF6'; // Púrpura
      default: return '#6B7280'; // Gris
    }
  };

  // Ícono según tipo de espacio
  const getIconoTipo = () => {
    switch (espacio.tipo) {
      case 'CARRO': return '🚗';
      case 'MOTO': return '🏍️';
      case 'DISCAPACITADO': return '♿';
      default: return '📦';
    }
  };

  const handleClick = () => {
    if (espacio.estado === 'DISPONIBLE' && isCliente) {
      onReservar(espacio);
    } else {
      onClick(espacio);
    }
  };

  return (
    <g
      ref={(node) => {
        dropRef(node);
        if (espacio.estado === "OCUPADO") dragRef(node);
      }}
      transform={`translate(${x}, ${y})`}
      className="espacio-croquis cursor-pointer"
      onClick={handleClick}
      {...(espacio.estado === "OCUPADO" ? { ...attributes, ...listeners } : {})}
    >
      {/* Rectángulo del espacio */}
      <rect
        width="65"
        height="45"
        rx="4"
        fill={getColorEstado()}
        stroke={isOver ? "#60A5FA" : "#FFFFFF"}
        strokeWidth={isOver ? "3" : "2"}
        opacity={espacio.estado === 'MANTENIMIENTO' ? 0.5 : 0.9}
        className="transition-all duration-200 hover:stroke-blue-400"
      />
      
      {/* Líneas de demarcación del espacio */}
      <rect
        width="65"
        height="45"
        rx="4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeDasharray="5,2"
        opacity="0.7"
      />
      
      {/* Número del espacio */}
      <text
        x="32.5"
        y="15"
        textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: '10px' }}
      >
        {espacio.numero}
      </text>
      
      {/* Ícono del tipo */}
      <text
        x="32.5"
        y="30"
        textAnchor="middle"
        style={{ fontSize: '14px' }}
      >
        {getIconoTipo()}
      </text>
      
      {/* Información adicional si está ocupado */}
      {ocupadoPor && (
        <text
          x="32.5"
          y="40"
          textAnchor="middle"
          className="fill-white"
          style={{ fontSize: '6px' }}
        >
          {ocupadoPor.split(' - ')[0]} {/* Solo la placa */}
        </text>
      )}
      
      {/* Efecto hover */}
      <rect
        width="65"
        height="45"
        rx="4"
        fill="rgba(255,255,255,0.1)"
        className="opacity-0 hover:opacity-100 transition-opacity duration-200"
      />
      
      {/* Botón reservar para clientes */}
      {isCliente && espacio.estado === 'DISPONIBLE' && (
        <g className="reservar-btn opacity-0 hover:opacity-100 transition-opacity">
          <rect x="45" y="-10" width="25" height="15" rx="2" fill="#3B82F6"/>
          <text x="57.5" y="0" textAnchor="middle" className="fill-white" style={{ fontSize: '6px' }}>
            Reservar
          </text>
        </g>
      )}
    </g>
  );
}