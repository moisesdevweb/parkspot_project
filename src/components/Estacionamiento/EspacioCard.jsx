import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function EspacioCard({ espacio, ocupadoPor, onClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `espacio-${espacio.id}`,
  });

  const estadoColors = {
    DISPONIBLE: "bg-green-700 border-green-500 hover:bg-green-600",
    RESERVADO: "bg-yellow-700 border-yellow-500 hover:bg-yellow-600", 
    OCUPADO: "bg-red-700 border-red-500 hover:bg-red-600 cursor-pointer",
    MANTENIMIENTO: "bg-gray-700 border-gray-500"
  };

  const color = estadoColors[espacio.estado] || "bg-gray-600 border-gray-400";
  const canDrop = espacio.estado === "DISPONIBLE" || espacio.estado === "RESERVADO";

  return (
    <div
      ref={setNodeRef}
      onClick={() => onClick?.(espacio)}
      className={`
        relative p-3 rounded-lg border-2 transition-all
        ${color}
        ${isOver && canDrop ? "ring-2 ring-blue-400 scale-105" : ""}
      `}
    >
      <div className="text-white font-bold text-lg mb-1">{espacio.numero}</div>
      <div className="text-xs text-gray-200 mb-2">
        {espacio.tipo} - S/.{espacio.tarifaPorHora}/h
      </div>
      <div className="text-xs font-semibold text-white">
        {espacio.estado}
      </div>
      {ocupadoPor && (
        <div className="text-xs text-gray-200 mt-1 truncate">
          {ocupadoPor}
        </div>
      )}
    </div>
  );
}