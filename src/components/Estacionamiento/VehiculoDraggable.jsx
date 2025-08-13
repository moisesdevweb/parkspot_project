import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function VehiculoDraggable({ vehiculo, cliente }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `vehiculo-${vehiculo.id}`,
    data: {
      tipo: "vehiculo",
      vehiculoId: vehiculo.id,
      clienteId: cliente?.id,
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded-lg border bg-blue-800 border-blue-600 text-white cursor-grab
        hover:bg-blue-700 transition-colors
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div className="font-semibold text-sm">{vehiculo.placa}</div>
      <div className="text-xs text-blue-200">
        {vehiculo.marca} {vehiculo.modelo}
      </div>
    </div>
  );
}