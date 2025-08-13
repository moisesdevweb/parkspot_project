import { useCallback, useEffect, useState } from "react";
import { authFetch, getToken, getUser } from "../utils/api";

export default function useEstacionamientoData() {
  const [espacios, setEspacios] = useState([]);
  const [regActivos, setRegActivos] = useState([]);

  // Determinar qué endpoint usar según el rol
  const user = getUser();
  const roles = (user?.roles || []).map(r => r?.name ?? r);
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isVigilante = roles.includes("ROLE_VIGILANTE");

  const fetchEspacios = useCallback(async () => {
    if (!getToken()) return;
    try {
      // ADMIN usa su endpoint, VIGILANTE/otros usan el general
      const endpoint = isAdmin 
        ? "/api/admin/espacios/todos"
        : "/api/estacionamiento/espacios";
      
      const res = await authFetch(endpoint);
      const data = await res.json();
      setEspacios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching espacios:", error);
      setEspacios([]);
    }
  }, [isAdmin]);

  const fetchRegActivos = useCallback(async () => {
    if (!getToken() || !isVigilante) return; // Solo vigilantes ven registros activos
    try {
      const res = await authFetch("/api/estacionamiento/registros-activos");
      const data = await res.json();
      setRegActivos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching registros activos:", error);
      setRegActivos([]);
    }
  }, [isVigilante]);

  useEffect(() => {
    fetchEspacios();
    fetchRegActivos();
    const id = setInterval(() => {
      if (getToken()) {
        fetchEspacios();
        fetchRegActivos();
      }
    }, 8000);
    return () => clearInterval(id);
  }, [fetchEspacios, fetchRegActivos]);

  const registrarEntrada = useCallback(
    async ({ clienteId, vehiculoId, espacioId, observaciones }) => {
      const res = await authFetch("/api/estacionamiento/registrar-entrada", {
        method: "POST",
        body: JSON.stringify({ clienteId, vehiculoId, espacioId, observaciones }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo registrar la entrada");
      await Promise.all([fetchEspacios(), fetchRegActivos()]);
      return data;
    },
    [fetchEspacios, fetchRegActivos]
  );

  const registrarSalida = useCallback(
    async ({ registroId, observaciones }) => {
      const res = await authFetch("/api/estacionamiento/registrar-salida", {
        method: "POST",
        body: JSON.stringify({ registroId, observaciones }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo registrar la salida");
      await Promise.all([fetchEspacios(), fetchRegActivos()]);
      return data;
    },
    [fetchEspacios, fetchRegActivos]
  );

  return { espacios, regActivos, fetchEspacios, fetchRegActivos, registrarEntrada, registrarSalida };
}