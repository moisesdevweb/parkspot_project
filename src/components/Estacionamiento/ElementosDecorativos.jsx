// src/components/Estacionamiento/ElementosDecorativos.jsx
import React from 'react';

export default function ElementosDecorativos() {
  return (
    <g className="elementos-decorativos">
      {/* Edificio principal - Centro */}
      <g transform="translate(450, 300)">
        {/* Edificio base */}
        <rect width="300" height="200" fill="#DC2626" stroke="#B91C1C" strokeWidth="2" rx="8"/>
        
        {/* Ventanas */}
        <rect x="20" y="20" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="80" y="20" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="140" y="20" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="200" y="20" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="240" y="20" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        
        {/* Ventanas segunda fila */}
        <rect x="20" y="90" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="80" y="90" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="200" y="90" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        <rect x="240" y="90" width="40" height="50" fill="#FFFFFF" opacity="0.8" rx="4"/>
        
        {/* Puerta principal */}
        <rect x="130" y="120" width="40" height="80" fill="#8B4513" rx="4"/>
        <circle cx="160" cy="160" r="2" fill="#FCD34D"/>
        
        {/* Letrero PARKSPOT */}
        <rect x="80" y="160" width="140" height="25" fill="#1F2937" rx="4"/>
        <text x="150" y="177" textAnchor="middle" className="fill-white font-bold" style={{ fontSize: '14px' }}>
          PARKSPOT
        </text>
      </g>
      
      {/* Árboles esquina superior izquierda */}
      <g className="arboles-esquina-1">
        <g transform="translate(50, 80)">
          <rect x="12" y="30" width="6" height="30" fill="#8B4513"/>
          <circle cx="15" cy="30" r="20" fill="#22C55E"/>
          <circle cx="8" cy="25" r="8" fill="#16A34A"/>
          <circle cx="22" cy="25" r="8" fill="#16A34A"/>
        </g>
        
        <g transform="translate(120, 60)">
          <rect x="10" y="25" width="4" height="25" fill="#8B4513"/>
          <circle cx="12" cy="25" r="15" fill="#22C55E"/>
        </g>
      </g>
      
      {/* Árboles esquina superior derecha */}
      <g className="arboles-esquina-2">
        <g transform="translate(1080, 80)">
          <rect x="12" y="30" width="6" height="30" fill="#8B4513"/>
          <circle cx="15" cy="30" r="20" fill="#22C55E"/>
          <circle cx="8" cy="25" r="8" fill="#16A34A"/>
          <circle cx="22" cy="25" r="8" fill="#16A34A"/>
        </g>
        
        <g transform="translate(1120, 60)">
          <rect x="10" y="25" width="4" height="25" fill="#8B4513"/>
          <circle cx="12" cy="25" r="15" fill="#22C55E"/>
        </g>
      </g>
      
      {/* Árboles esquina inferior izquierda */}
      <g className="arboles-esquina-3">
        <g transform="translate(50, 650)">
          <rect x="12" y="30" width="6" height="30" fill="#8B4513"/>
          <circle cx="15" cy="30" r="20" fill="#22C55E"/>
          <circle cx="8" cy="25" r="8" fill="#16A34A"/>
          <circle cx="22" cy="25" r="8" fill="#16A34A"/>
        </g>
        
        <g transform="translate(120, 680)">
          <rect x="10" y="25" width="4" height="25" fill="#8B4513"/>
          <circle cx="12" cy="25" r="15" fill="#22C55E"/>
        </g>
      </g>
      
      {/* Árboles esquina inferior derecha */}
      <g className="arboles-esquina-4">
        <g transform="translate(1080, 650)">
          <rect x="12" y="30" width="6" height="30" fill="#8B4513"/>
          <circle cx="15" cy="30" r="20" fill="#22C55E"/>
          <circle cx="8" cy="25" r="8" fill="#16A34A"/>
          <circle cx="22" cy="25" r="8" fill="#16A34A"/>
        </g>
        
        <g transform="translate(1120, 680)">
          <rect x="10" y="25" width="4" height="25" fill="#8B4513"/>
          <circle cx="12" cy="25" r="15" fill="#22C55E"/>
        </g>
      </g>
      
      {/* Jardines laterales */}
      <g className="jardines">
        {/* Jardín izquierdo */}
        <ellipse cx="100" cy="400" rx="60" ry="100" fill="#22C55E" opacity="0.7"/>
        <circle cx="80" cy="350" r="15" fill="#16A34A"/>
        <circle cx="120" cy="380" r="12" fill="#16A34A"/>
        <circle cx="90" cy="450" r="18" fill="#16A34A"/>
        
        {/* Jardín derecho */}
        <ellipse cx="1100" cy="400" rx="60" ry="100" fill="#22C55E" opacity="0.7"/>
        <circle cx="1080" cy="350" r="15" fill="#16A34A"/>
        <circle cx="1120" cy="380" r="12" fill="#16A34A"/>
        <circle cx="1110" cy="450" r="18" fill="#16A34A"/>
        
        {/* Jardín superior central */}
        <ellipse cx="600" cy="50" rx="150" ry="30" fill="#22C55E" opacity="0.8"/>
        <circle cx="550" cy="45" r="8" fill="#16A34A"/>
        <circle cx="600" cy="40" r="10" fill="#16A34A"/>
        <circle cx="650" cy="45" r="8" fill="#16A34A"/>
      </g>
      
      {/* Entrada principal */}
      <g transform="translate(500, 750)">
        <rect width="200" height="30" fill="#FCD34D" rx="4"/>
        <rect width="200" height="30" fill="none" stroke="#F59E0B" strokeWidth="2" rx="4"/>
        <text x="100" y="20" textAnchor="middle" className="fill-gray-800 font-bold" style={{ fontSize: '12px' }}>
          🚪 ENTRADA PRINCIPAL 🚪
        </text>
      </g>
      
      {/* Señales direccionales */}
      <g className="senales">
        {/* Flecha entrada */}
        <g transform="translate(150, 200)">
          <path d="M 0 0 L 30 0 L 25 -5 M 30 0 L 25 5" stroke="#FCD34D" strokeWidth="3" fill="none"/>
          <text x="35" y="5" className="fill-yellow-300 text-xs font-semibold" style={{ fontSize: '10px' }}>
            INGRESO
          </text>
        </g>
        
        {/* Flecha salida */}
        <g transform="translate(1020, 300)">
          <path d="M 30 0 L 0 0 L 5 -5 M 0 0 L 5 5" stroke="#FCD34D" strokeWidth="3" fill="none"/>
          <text x="-35" y="5" className="fill-yellow-300 text-xs font-semibold" style={{ fontSize: '10px' }}>
            SALIDA
          </text>
        </g>
      </g>
      
      {/* Caseta de vigilancia */}
      <g transform="translate(150, 100)">
        <rect width="40" height="40" fill="#6B7280" stroke="#4B5563" strokeWidth="2" rx="4"/>
        <rect x="5" y="5" width="15" height="15" fill="#FFFFFF" opacity="0.8" rx="2"/>
        <rect x="20" y="5" width="15" height="15" fill="#FFFFFF" opacity="0.8" rx="2"/>
        <rect x="15" y="25" width="10" height="15" fill="#8B4513" rx="2"/>
        <text x="20" y="50" textAnchor="middle" className="fill-gray-300 text-xs" style={{ fontSize: '8px' }}>
          Vigilancia
        </text>
      </g>
      
      {/* Líneas de circulación */}
      <g className="circulacion" stroke="#FCD34D" strokeWidth="2" strokeDasharray="8,4" fill="none" opacity="0.6">
        {/* Línea de circulación principal */}
        <path d="M 200 400 Q 400 380 600 400 Q 800 420 1000 400"/>
        
        {/* Líneas secundarias */}
        <line x1="200" y1="200" x2="400" y2="250"/>
        <line x1="800" y1="250" x2="1000" y2="200"/>
        <line x1="200" y1="600" x2="400" y2="550"/>
        <line x1="800" y1="550" x2="1000" y2="600"/>
      </g>
      
      {/* Números de sección */}
      <g className="numeros-seccion">
        <g transform="translate(180, 120)">
          <circle r="20" fill="#3B82F6" opacity="0.8"/>
          <text textAnchor="middle" y="6" className="fill-white font-bold" style={{ fontSize: '14px' }}>A</text>
        </g>
        
        <g transform="translate(180, 320)">
          <circle r="20" fill="#3B82F6" opacity="0.8"/>
          <text textAnchor="middle" y="6" className="fill-white font-bold" style={{ fontSize: '14px' }}>B</text>
        </g>
        
        <g transform="translate(180, 520)">
          <circle r="20" fill="#3B82F6" opacity="0.8"/>
          <text textAnchor="middle" y="6" className="fill-white font-bold" style={{ fontSize: '14px' }}>C</text>
        </g>
      </g>
    </g>
  );
}