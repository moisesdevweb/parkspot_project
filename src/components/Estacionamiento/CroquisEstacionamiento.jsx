// src/components/Estacionamiento/CroquisEstacionamiento.jsx
import React, { useState, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import EspacioCroquis from './EspacioCroquis';
import ElementosDecorativos from './ElementosDecorativos';
import LeyendaEstados from './LeyendaEstados';
import ZoomControls from './ZoomControls';

export default function CroquisEstacionamiento({ 
  espacios, 
  ocupantesPorNumero, 
  onClickEspacio, 
  onDragEnd,
  isCliente,
  onReservar 
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Controles de zoom */}
      <ZoomControls 
        zoom={zoom} 
        onZoom={setZoom} 
        onReset={() => {setZoom(1); setPan({x:0, y:0});}} 
      />
      
      {/* Leyenda */}
      <LeyendaEstados />
      
      {/* SVG del croquis */}
      <div className="overflow-hidden" style={{ height: '600px' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1200 800"
          className="w-full h-full cursor-move"
          style={{ 
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center'
          }}
        >
          {/* Fondo del estacionamiento */}
          <defs>
            <pattern id="asphalt" patternUnits="userSpaceOnUse" width="100" height="100">
              <rect width="100" height="100" fill="#374151"/>
              <circle cx="10" cy="10" r="1" fill="#4B5563"/>
              <circle cx="50" cy="30" r="0.5" fill="#6B7280"/>
              <circle cx="80" cy="70" r="1.5" fill="#4B5563"/>
            </pattern>
            
            <linearGradient id="grass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E"/>
              <stop offset="100%" stopColor="#16A34A"/>
            </linearGradient>
          </defs>
          
          {/* Superficie del estacionamiento */}
          <rect width="1200" height="800" fill="url(#asphalt)"/>
          
          {/* Elementos decorativos de fondo */}
          <ElementosDecorativos />
          
          {/* Líneas de demarcación principales */}
          <g className="demarcacion-lines">
            <line x1="100" y1="150" x2="1100" y2="150" stroke="#FCD34D" strokeWidth="3" strokeDasharray="10,5"/>
            <line x1="100" y1="350" x2="1100" y2="350" stroke="#FCD34D" strokeWidth="3" strokeDasharray="10,5"/>
            <line x1="100" y1="550" x2="1100" y2="550" stroke="#FCD34D" strokeWidth="3" strokeDasharray="10,5"/>
            
            <line x1="200" y1="50" x2="200" y2="750" stroke="#FCD34D" strokeWidth="2" strokeDasharray="5,3"/>
            <line x1="1000" y1="50" x2="1000" y2="750" stroke="#FCD34D" strokeWidth="2" strokeDasharray="5,3"/>
          </g>
          
          {/* Espacios de estacionamiento organizados por secciones */}
          <DndContext onDragEnd={onDragEnd}>
            <g className="espacios-grupo">
              {/* Sección A - Parte superior */}
              {espacios
                .filter(e => e.numero.startsWith('A'))
                .map((espacio, index) => (
                  <EspacioCroquis
                    key={espacio.id}
                    espacio={espacio}
                    x={220 + (index % 10) * 75}
                    y={80}
                    ocupadoPor={ocupantesPorNumero.get(espacio.numero)}
                    onClick={onClickEspacio}
                    isCliente={isCliente}
                    onReservar={onReservar}
                  />
                ))}
              
              {/* Sección B - Parte media */}
              {espacios
                .filter(e => e.numero.startsWith('B'))
                .map((espacio, index) => (
                  <EspacioCroquis
                    key={espacio.id}
                    espacio={espacio}
                    x={220 + (index % 10) * 75}
                    y={280}
                    ocupadoPor={ocupantesPorNumero.get(espacio.numero)}
                    onClick={onClickEspacio}
                    isCliente={isCliente}
                    onReservar={onReservar}
                  />
                ))}
              
              {/* Sección C - Parte inferior */}
              {espacios
                .filter(e => e.numero.startsWith('C'))
                .map((espacio, index) => (
                  <EspacioCroquis
                    key={espacio.id}
                    espacio={espacio}
                    x={220 + (index % 10) * 75}
                    y={480}
                    ocupadoPor={ocupantesPorNumero.get(espacio.numero)}
                    onClick={onClickEspacio}
                    isCliente={isCliente}
                    onReservar={onReservar}
                  />
                ))}
              
              {/* Si no hay espacios con prefijo, mostrar todos en grid */}
              {espacios.filter(e => e.numero.startsWith('A')).length === 0 &&
               espacios.filter(e => e.numero.startsWith('B')).length === 0 &&
               espacios.filter(e => e.numero.startsWith('C')).length === 0 && (
                <>
                  {espacios.map((espacio, index) => (
                    <EspacioCroquis
                      key={espacio.id}
                      espacio={espacio}
                      x={220 + (index % 10) * 75}
                      y={80 + Math.floor(index / 10) * 100}
                      ocupadoPor={ocupantesPorNumero.get(espacio.numero)}
                      onClick={onClickEspacio}
                      isCliente={isCliente}
                      onReservar={onReservar}
                    />
                  ))}
                </>
              )}
            </g>
          </DndContext>
        </svg>
      </div>
    </div>
  );
}