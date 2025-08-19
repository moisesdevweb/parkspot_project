// src/components/Estacionamiento/ZoomControls.jsx
import React from 'react';
import { PlusIcon, MinusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function ZoomControls({ zoom, onZoom, onReset }) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={() => onZoom(Math.min(zoom * 1.2, 3))}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
        title="Acercar"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => onZoom(Math.max(zoom / 1.2, 0.5))}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
        title="Alejar"
      >
        <MinusIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={onReset}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
        title="Vista completa"
      >
        <ArrowsPointingOutIcon className="w-5 h-5" />
      </button>
      
      <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded text-center">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}