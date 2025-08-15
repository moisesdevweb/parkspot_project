import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { getUser } from "../../utils/api";

export default function EspacioCard({ espacio, ocupadoPor, onClick }) {
  const user = getUser();
  const isAdmin = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_ADMIN");
  
  // Droppable (siempre - todos pueden recibir drops)
  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: `espacio-${espacio.id}`,
  });

  // Draggable (solo espacios ocupados para admin)
  const shouldBeDraggable = isAdmin && espacio.estado === "OCUPADO";
  const { 
    attributes, 
    listeners, 
    setNodeRef: setDragRef, 
    isDragging 
  } = useDraggable({
    id: `espacio-ocupado-${espacio.id}`,
    disabled: !shouldBeDraggable,
    data: {
      tipo: "espacio-ocupado",
      espacioOrigenId: espacio.id,
      numeroEspacio: espacio.numero
    },
  });

  // Combinar refs si es draggable
  const setNodeRef = shouldBeDraggable 
    ? (node) => { setDropRef(node); setDragRef(node); }
    : setDropRef;

  // Función para obtener clase de fondo según estado
  const getBackgroundClass = (estado) => {
    switch (estado) {
      case "DISPONIBLE": return "bg-green-600";
      case "OCUPADO": return "bg-red-600";
      case "RESERVADO": return "bg-yellow-600";
      case "MANTENIMIENTO": return "bg-gray-600";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...(shouldBeDraggable ? attributes : {})}
      {...(shouldBeDraggable ? listeners : {})}
      onClick={() => onClick?.(espacio)}
      className={`
        ${getBackgroundClass(espacio.estado)}
        ${isOver ? "ring-2 ring-blue-400 ring-opacity-75" : ""}
        ${isDragging ? "opacity-50 scale-95 rotate-2" : ""}
        ${shouldBeDraggable ? "cursor-move hover:shadow-lg" : "cursor-pointer"}
        p-3 rounded-lg text-white text-sm font-medium transition-all duration-200
        hover:scale-105 relative min-h-[100px] flex flex-col justify-center
      `}
    >
      {/* Contenido del espacio */}
      <div className="text-center">
        <div className="font-bold text-lg mb-1">{espacio.numero}</div>
        <div className="text-xs opacity-90 mb-1">
          {espacio.tipoVehiculo} - S/{espacio.tarifaHora}/h
        </div>
        <div className="text-xs font-semibold mb-2">
          {espacio.estado}
        </div>
        {ocupadoPor && (
          <div className="text-xs bg-black/30 rounded p-1.5 break-words">
            {ocupadoPor}
          </div>
        )}
      </div>

      {/* Indicador visual para admin cuando es draggable */}
      {shouldBeDraggable && (
        <div className="absolute top-1 right-1">
          <div className="bg-yellow-300 text-gray-800 rounded-full p-1" title="Arrastrable para reasignar">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 6v5h5l-6 6-6-6h5V6h2z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Indicador de drop zone cuando está sobre él */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-400/20 rounded-lg border-2 border-blue-400 border-dashed flex items-center justify-center">
          <span className="text-blue-100 font-semibold text-xs">Soltar aquí</span>
        </div>
      )}
    </div>
  );
}