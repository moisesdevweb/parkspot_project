import React from "react";
import VehiculoDraggable from "./VehiculoDraggable";

export default function PanelClientesVehiculos({
  busca,
  onBuscar,
  clientes,
  clienteSel,
  onSeleccionarCliente,
  vehiculos,
}) {
  return (
    <aside className="w-full rounded-xl border border-gray-700 bg-[#1b2129]/95 shadow-xl">
      <div className="px-4 py-3 border-b border-gray-700 text-white font-semibold">
        Panel de Clientes/Vehículos
      </div>
      <div className="p-3 space-y-3">
        {/* Buscador */}
        <input
          className="w-full rounded bg-gray-800 text-white px-3 py-2 placeholder-gray-400"
          placeholder="Buscar cliente por nombre o DNI..."
          value={busca}
          onChange={(e) => onBuscar(e.target.value)}
        />

        {/* Lista de clientes */}
        <div className="max-h-36 overflow-auto space-y-1">
          {clientes.length === 0 ? (
            <div className="text-gray-500 text-sm">
              {busca ? "No se encontraron clientes" : "Escribe para buscar clientes"}
            </div>
          ) : (
            clientes.map(c => (
              <button
                key={c.id}
                onClick={() => onSeleccionarCliente(c)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  clienteSel?.id === c.id 
                    ? "bg-blue-700 text-white ring-2 ring-blue-500" 
                    : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                }`}
              >
                <div className="text-sm font-medium">
                  {c.nombreCompleto} {c.apellidos}
                </div>
                <div className="text-xs text-gray-400">DNI: {c.dni}</div>
              </button>
            ))
          )}
        </div>

        {/* Título de vehículos */}
        <div className="text-xs text-gray-400 font-semibold">
          Vehículos {clienteSel ? `de ${clienteSel.nombreCompleto}` : ""}
        </div>

        {/* Lista de vehículos arrastrables */}
        <div className="space-y-2 max-h-64 overflow-auto">
          {vehiculos.length > 0 ? (
            vehiculos.map(v => (
              <VehiculoDraggable 
                key={v.id} 
                vehiculo={v} 
                cliente={clienteSel} 
              />
            ))
          ) : (
            <div className="text-xs text-gray-500 text-center py-4">
              {clienteSel 
                ? "Este cliente no tiene vehículos registrados" 
                : "Selecciona un cliente para ver sus vehículos"
              }
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}