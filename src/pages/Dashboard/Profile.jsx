import React, { useEffect, useState } from "react";
import { Input, Spinner } from "@heroui/react";
import Button from "../../components/Button";
import { UserCircleIcon, PencilIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';
import { authFetch, getUser } from "../../utils/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [user] = useState(() => getUser());

  useEffect(() => {
    if (!user?.username) return;

    const loadProfile = async () => {
      try {
        const response = await authFetch(`/api/persona/perfil/${user.username}`);
        if (!response.ok) throw new Error("Error al cargar perfil");
        
        const data = await response.json();
        setProfile(data);
        setForm(data);
      } catch (error) {
        toast.error("No se pudo cargar el perfil");
        setErrors({ fetch: "Error al cargar los datos del perfil" });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    if (name === "telefono") {
      if (!value.match(/^\d{0,9}$/)) {
        setErrors(prev => ({ ...prev, telefono: "Solo se permiten números" }));
      } else if (value.length > 0 && value.length !== 9) {
        setErrors(prev => ({ ...prev, telefono: "Debe tener 9 dígitos" }));
      } else {
        setErrors(prev => ({ ...prev, telefono: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nombreCompleto?.trim()) {
      newErrors.nombreCompleto = "Nombre requerido";
    }
    
    if (!form.telefono?.match(/^\d{9}$/)) {
      newErrors.telefono = "Teléfono inválido (9 dígitos)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor corrige los errores");
      return;
    }

    setSaving(true);
    try {
      const response = await authFetch(`/api/persona/perfil/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: form.nombreCompleto,
          apellidos: form.apellidos,
          direccion: form.direccion,
          telefono: form.telefono,
        }),
      });

      if (!response.ok) throw new Error("Error en la actualización");
      
      const updatedData = await response.json();
      setProfile(updatedData);
      setEditMode(false);
      toast.success("¡Perfil actualizado correctamente!");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
      setErrors({ save: "Error en el servidor. Intenta nuevamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setEditMode(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spinner size="xl" />
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el perfil</h2>
          <p className="text-gray-600 mb-6">{errors.fetch}</p>
          <Button color="primary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="w-8 h-8" />
              <span className="font-medium">{user.username}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Avatar y email */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <UserCircleIcon className="w-24 h-24 text-blue-400" />
              {editMode && (
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
                  title="Cambiar foto"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-600 bg-blue-50 px-4 py-2 rounded-full text-sm">
              {profile.email}
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Usuario"
                  value={profile.username}
                  disabled
                  icon={<UserCircleIcon className="w-5 h-5 text-gray-400" />}
                />
              </div>
              <div>
                <Input
                  label="DNI"
                  value={profile.dni}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Nombre Completo"
                  name="nombreCompleto"
                  value={form.nombreCompleto || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  error={errors.nombreCompleto}
                  placeholder="Ej: Juan Carlos"
                />
              </div>
              <div>
                <Input
                  label="Apellidos"
                  name="apellidos"
                  value={form.apellidos || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Ej: Pérez García"
                />
              </div>
            </div>

            <div>
              <Input
                label="Dirección"
                name="direccion"
                value={form.direccion || ""}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Ej: Av. Principal #123"
              />
            </div>

            <div>
              <Input
                label="Teléfono"
                name="telefono"
                value={form.telefono || ""}
                onChange={handleChange}
                disabled={!editMode}
                required
                error={errors.telefono}
                placeholder="Ej: 987654321"
                maxLength={9}
              />
              {editMode && (
                <p className="text-sm text-gray-500 mt-1">
                  Formato: 9 dígitos sin espacios
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              {editMode ? (
                <>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    icon={<XMarkIcon className="w-5 h-5" />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={saving || Object.values(errors).some(e => e)}
                    icon={saving ? <Spinner size="sm" /> : <CheckCircleIcon className="w-5 h-5" />}
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  icon={<PencilIcon className="w-5 h-5" />}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Notificación de éxito */}
        {!editMode && profile.updatedAt && (
          <div className="bg-green-50 border-t border-green-200 p-4 text-center text-sm text-green-700">
            <div className="flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Última actualización: {new Date(profile.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;