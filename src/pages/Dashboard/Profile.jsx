import React, { useEffect, useState } from "react";
import { Input, Spinner } from "@heroui/react";
import Button from "../../components/Button";
import { UserCircleIcon } from "@heroicons/react/24/solid"; // Si tienes Heroicons
import toast from 'react-hot-toast';

function Profile() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (!user?.username || !token) return;
    fetch(`http://localhost:8080/api/persona/perfil/${user.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPerfil(data);
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el perfil");
        setLoading(false);
      });
  }, [user, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.telefono.match(/^\d{9}$/)) {
      toast.error("El teléfono debe tener 9 dígitos");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/persona/perfil/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreCompleto: form.nombreCompleto,
          apellidos: form.apellidos,
          direccion: form.direccion,
          telefono: form.telefono,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setPerfil({ ...perfil, ...form });
      setEdit(false);
      toast.success("¡Perfil actualizado correctamente!"); // <-- Notificación de éxito
    } catch {
      setError("No se pudo actualizar el perfil");
      toast.error("Error al actualizar el perfil"); // <-- Notificación de error
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200"><Spinner /></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 relative">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="relative">
            {/* Si tienes foto de perfil, reemplaza el icono por <img src={perfil.fotoUrl} ... /> */}
            <UserCircleIcon className="w-24 h-24 text-blue-400" />
            {/* Botón para cambiar foto (opcional, aún no funcional) */}
            <button
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition"
              title="Cambiar foto"
              disabled
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-2 mb-1">Mi Perfil</h2>
          <p className="text-gray-500">{perfil.email}</p>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Usuario" value={perfil.username} disabled className="w-full" />
          <Input label="DNI" value={perfil.dni} disabled className="w-full" />
          <Input
            label="Nombre Completo"
            name="nombreCompleto"
            value={form.nombreCompleto || ""}
            onChange={handleChange}
            disabled={!edit}
            className="w-full"
          />
          <Input
            label="Apellidos"
            name="apellidos"
            value={form.apellidos || ""}
            onChange={handleChange}
            disabled={!edit}
            className="w-full"
          />
          <Input
            label="Dirección"
            name="direccion"
            value={form.direccion || ""}
            onChange={handleChange}
            disabled={!edit}
            className="w-full"
          />
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
            disabled={!edit}
            className="w-full"
          />
          {edit && (
            <div className="flex gap-2 mt-4">
              <Button color="primary" type="submit" disabled={loading}>
                Guardar
              </Button>
              <Button color="secondary" type="button" onClick={() => { setEdit(false); setForm(perfil); }}>
                Cancelar
              </Button>
            </div>
          )}
        </form>
        {!edit && (
          <div className="flex gap-2 mt-4">
            <Button color="primary" type="button" onClick={() => setEdit(true)}>
              Editar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;