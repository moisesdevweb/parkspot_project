import { EyeIcon } from "@heroicons/react/24/outline";

export default function TablaReportes({ reportes, onVerDetalle, modo = "admin", onSubirImagen }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-[#23272f] shadow">
      <table className="min-w-full text-sm text-gray-200">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Vehículo</th>
            <th className="px-4 py-2">Vigilante</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-700/30">
              <td className="px-4 py-2">{r.id}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${r.estado === "PENDIENTE" ? "bg-yellow-600/30 text-yellow-300" : ""}
                  ${r.estado === "APROBADO" ? "bg-green-700/30 text-green-300" : ""}
                  ${r.estado === "CANCELADO" ? "bg-red-700/30 text-red-300" : ""}
                `}>
                  {r.estado}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(r.fechaCreacion).toLocaleString()}</td>
              <td className="px-4 py-2">{r.clienteNombre} {r.clienteApellidos}</td>
              <td className="px-4 py-2">{r.vehiculoPlaca} ({r.vehiculoMarca})</td>
              <td className="px-4 py-2">{r.vigilanteNombre}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded flex items-center gap-1"
                  onClick={() => onVerDetalle(r)}
                  title="Ver Detalle"
                >
                  <EyeIcon className="w-4 h-4" /> Ver
                </button>
                {modo === "vigilante" && (
                  <button
                    className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
                    onClick={() => onSubirImagen(r)}
                    title="Subir Imágenes"
                  >
                    📷 Subir Imagen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportes.length === 0 && (
        <div className="text-center text-gray-400 py-8">No hay reportes</div>
      )}
    </div>
  );
}