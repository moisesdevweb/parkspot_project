import React, { useState, useEffect, useRef, useCallback } from "react";

export default function BuscadorPersona({
  onBuscar,
  onLimpiar,
  placeholder = "Buscar por nombre..."
}) {
  const [nombre, setNombre] = useState("");
  const timeoutRef = useRef(null);

  // Memoiza las funciones para evitar el warning
  const memoizedOnBuscar = useCallback(onBuscar, [onBuscar]);
  const memoizedOnLimpiar = useCallback(onLimpiar, [onLimpiar]);

  useEffect(() => {
    // Limpia el timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configura un nuevo timeout
    timeoutRef.current = setTimeout(() => {
      if (nombre.trim() === "") {
        memoizedOnLimpiar?.();
      } else if (nombre.trim().length >= 2) { // <-- Busca desde 2 caracteres
        memoizedOnBuscar(nombre.trim());
      }
    }, 600);

    // Cleanup al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nombre, memoizedOnBuscar, memoizedOnLimpiar]);

  return (
    <input
      type="text"
      className="px-3 py-2 rounded bg-gray-800 text-white w-full"
      placeholder={placeholder}
      value={nombre}
      onChange={e => setNombre(e.target.value)}
    />
  );
}