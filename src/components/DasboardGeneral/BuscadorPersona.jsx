import React, { useState, useEffect, useRef } from "react";

export default function BuscadorPersona({
  onBuscar,
  onLimpiar,
  placeholder = "Buscar por nombre..."
}) {
  const [nombre, setNombre] = useState("");
  const [debouncedNombre, setDebouncedNombre] = useState(nombre);
  const prevNombre = useRef("");

  // Debounce: espera 400ms después de dejar de escribir
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNombre(nombre);
    }, 400);
    return () => clearTimeout(handler);
  }, [nombre]);

  useEffect(() => {
    // Solo busca si hay texto
    if (debouncedNombre.trim() !== "") {
      onBuscar(debouncedNombre.trim());
    }
    // Si el usuario borra todo, recarga la lista solo una vez
    else if (prevNombre.current !== "") {
      if (onLimpiar) onLimpiar();
    }
    prevNombre.current = debouncedNombre;
  }, [debouncedNombre, onBuscar, onLimpiar]);

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        className="px-3 py-2 rounded bg-gray-800 text-white w-full"
        placeholder={placeholder}
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
    </div>
  );
}