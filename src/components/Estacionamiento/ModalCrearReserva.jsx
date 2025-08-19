import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { authFetch } from "../../utils/api";
import toast from "react-hot-toast";

export default function ModalCrearReserva({ open, onClose, espacio, onReservaCreada }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoId, setVehiculoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener fechas mínimas y máximas
  const obtenerFechaMinima = () => {
    const ahora = new Date();
    // Agregar 1 hora y 10 minutos de buffer
    ahora.setHours(ahora.getHours() + 1, ahora.getMinutes() + 10, 0, 0);
    return ahora.toISOString().slice(0, 16); // formato: yyyy-MM-ddTHH:mm
  };

  const obtenerFechaMaxima = () => {
    const ahora = new Date();
    // Máximo 2 días (48 horas) desde ahora
    ahora.setDate(ahora.getDate() + 2);
    return ahora.toISOString().slice(0, 16);
  };

  // Cargar vehículos del cliente
  useEffect(() => {
    if (open) {
      console.log("🚗 Cargando vehículos del cliente...");
      authFetch("/api/cliente/mis-vehiculos")
        .then(res => res.json())
        .then(data => {
          console.log("🚗 Vehículos recibidos:", data);
          setVehiculos(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("❌ Error cargando vehículos:", err);
          setVehiculos([]);
        });
      
      // Limpiar formulario
      setVehiculoId("");
      setFechaInicio("");
      setFechaFin("");
      setObservaciones("");
    }
  }, [open]);

  // Validar horarios y fechas
  const validarHorarios = () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Por favor completa las fechas de inicio y fin");
      return false;
    }
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const ahora = new Date();
    
    // Validar que la fecha de inicio sea al menos 1 hora después de ahora
    const minimoPermitido = new Date(ahora.getTime() + 60 * 60 * 1000); // +1 hora
    if (inicio < minimoPermitido) {
      toast.error("La reserva debe ser al menos 1 hora después de la hora actual");
      return false;
    }
    
    // Validar que la fecha de fin sea después del inicio
    if (fin <= inicio) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return false;
    }
    
    // Validar horario de funcionamiento (6:00 AM - 11:00 PM)
    const horaInicio = inicio.getHours();
    const horaFin = fin.getHours();
    
    if (horaInicio < 6 || horaInicio > 23) {
      toast.error("La hora de inicio debe estar entre las 6:00 AM y 11:00 PM");
      return false;
    }
    
    if (horaFin < 6 || horaFin > 23) {
      toast.error("La hora de fin debe estar entre las 6:00 AM y 11:00 PM");
      return false;
    }
    
    // Validar duración máxima (48 horas)
    const duracionHoras = (fin - inicio) / (1000 * 60 * 60);
    if (duracionHoras > 48) {
      toast.error("La reserva no puede durar más de 48 horas (2 días)");
      return false;
    }
    
    if (duracionHoras < 1) {
      toast.error("La reserva debe durar al menos 1 hora");
      return false;
    }
    
    return true;
  };

  // Función para reservas rápidas
  const setReservaRapida = (tipo) => {
    const ahora = new Date();
    let inicio, fin;
    
    switch (tipo) {
      case "hoy-4h":
        inicio = new Date(ahora.getTime() + 70 * 60 * 1000); // 1h 10min después
        fin = new Date(inicio.getTime() + 4 * 60 * 60 * 1000); // +4 horas
        break;
        
      case "noche":
        inicio = new Date();
        inicio.setHours(20, 0, 0, 0); // 8 PM hoy
        if (inicio <= ahora) {
          inicio.setDate(inicio.getDate() + 1); // Si ya pasaron las 8 PM, mañana
        }
        fin = new Date(inicio.getTime() + 12 * 60 * 60 * 1000); // +12 horas
        break;
        
      case "manana-8h":
        inicio = new Date(ahora.getTime() + 24 * 60 * 60 * 1000); // Mañana
        inicio.setHours(8, 0, 0, 0); // 8 AM
        fin = new Date(inicio.getTime() + 8 * 60 * 60 * 1000); // +8 horas
        break;
        
      case "fin-semana": {
        // CORREGIDO: Usar bloque {} para variables locales
        const diaActual = ahora.getDay();
        let diasHastaViernes;
        
        // Calcular días hasta el próximo viernes a las 6 PM
        if (diaActual === 5 && ahora.getHours() >= 17) {
          // Si es viernes después de las 5 PM, ir al próximo viernes
          diasHastaViernes = 7;
        } else if (diaActual === 6) {
          // Si es sábado, 6 días hasta viernes
          diasHastaViernes = 6;
        } else {
          // Para cualquier otro día, calcular días hasta viernes
          diasHastaViernes = (5 - diaActual + 7) % 7;
          if (diasHastaViernes === 0 && ahora.getHours() >= 17) {
            diasHastaViernes = 7; // Si ya es muy tarde el viernes, próximo viernes
          }
        }
        
        inicio = new Date(ahora.getTime() + diasHastaViernes * 24 * 60 * 60 * 1000);
        inicio.setHours(18, 0, 0, 0); // 6 PM del viernes
        
        // Asegurar que sea al menos 1 hora después de ahora
        const minimoPermitido = new Date(ahora.getTime() + 60 * 60 * 1000);
        if (inicio < minimoPermitido) {
          inicio.setDate(inicio.getDate() + 7); // Próximo viernes
        }
        
        fin = new Date(inicio.getTime() + 48 * 60 * 60 * 1000); // 48 horas después
        break;
      }
      
      default:
        return;
    }
    
    setFechaInicio(inicio.toISOString().slice(0, 16));
    setFechaFin(fin.toISOString().slice(0, 16));
  };

  // Manejar envío del formulario
  const handleReservar = async () => {
    if (!vehiculoId) {
      toast.error("Por favor selecciona un vehículo");
      return;
    }
    
    if (!validarHorarios()) return;
    
    setLoading(true);
    try {
      const reservaData = {
        vehiculoId: parseInt(vehiculoId),
        espacioId: espacio.id,
        fechaInicio,
        fechaFin,
        observaciones: observaciones.trim() || null
      };

      console.log("📤 Enviando reserva:", reservaData);

      const res = await authFetch("/api/cliente/crear-reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Error al crear la reserva");
      }

      toast.success(data.message || "Reserva creada exitosamente");
      onReservaCreada();
      onClose();
    } catch (error) {
      console.error("❌ Error creando reserva:", error);
      toast.error(error.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Calcular información de la reserva
  const calcularInfoReserva = () => {
    if (!fechaInicio || !fechaFin) return null;
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const duracionHoras = (fin - inicio) / (1000 * 60 * 60);
    const esHoy = inicio.toDateString() === new Date().toDateString();
    
    return {
      duracion: Math.round(duracionHoras * 10) / 10, // Redondear a 1 decimal
      esHoy,
      tipoReserva: esHoy ? "urgente" : "programada"
    };
  };

  const infoReserva = calcularInfoReserva();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-white">Reservar Espacio</h3>
            <p className="text-gray-400 text-sm">Espacio {espacio?.numero}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Seleccionar Vehículo */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Seleccionar Vehículo *
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={vehiculoId}
              onChange={(e) => setVehiculoId(e.target.value)}
              required
            >
              <option value="">Selecciona un vehículo...</option>
              {vehiculos.map(vehiculo => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.color})
                </option>
              ))}
            </select>
          </div>

          {/* Botones de Reserva Rápida */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Reservas Rápidas
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                onClick={() => setReservaRapida("hoy-4h")}
              >
                Hoy 4 horas
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                onClick={() => setReservaRapida("noche")}
              >
                Toda la noche
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                onClick={() => setReservaRapida("manana-8h")}
              >
                Mañana 8h
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                onClick={() => setReservaRapida("fin-semana")}
              >
                Fin de semana
              </button>
            </div>
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Fecha y Hora de Inicio *
            </label>
            <input
              type="datetime-local"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              min={obtenerFechaMinima()}
              max={obtenerFechaMaxima()}
              required
            />
          </div>

          {/* Fecha de Fin */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Fecha y Hora de Fin *
            </label>
            <input
              type="datetime-local"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || obtenerFechaMinima()}
              max={obtenerFechaMaxima()}
              required
            />
          </div>

          {/* Información de la Reserva */}
          {infoReserva && (
            <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Duración:</span>
                <span className="text-white font-medium">{infoReserva.duracion}h</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-300">Tipo:</span>
                <span className={`font-medium ${infoReserva.esHoy ? 'text-orange-400' : 'text-green-400'}`}>
                  {infoReserva.tipoReserva === 'urgente' ? '🚨 Urgente (hoy)' : '📅 Programada'}
                </span>
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Observaciones
            </label>
            <textarea
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Información adicional (opcional)"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          {/* Info sobre horarios */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              📋 <strong>Recordatorio:</strong> Las reservas deben ser entre las 6:00 AM y 11:00 PM, 
              con máximo 48 horas de duración y al menos 1 hora de anticipación.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleReservar}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={loading || !vehiculoId || !fechaInicio || !fechaFin}
          >
            {loading ? "Creando..." : "Reservar"}
          </button>
        </div>
      </div>
    </div>
  );
}