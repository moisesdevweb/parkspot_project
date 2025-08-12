import React, { useEffect, useState } from "react";
import { Input, Spinner } from "@heroui/react";
import Button from "../../components/Button";
import { 
  UserCircleIcon, 
  PencilIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  HomeIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CogIcon
} from "@heroicons/react/24/solid";
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
        setLoading(true);
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
    
    // Validación en tiempo real para teléfono
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <Spinner size="xl" className="text-indigo-500" />
          <p className="mt-4 text-gray-400">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-200 mb-2">Error al cargar el perfil</h2>
          <p className="text-gray-400 mb-6">{errors.fetch}</p>
          <Button color="primary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-700 to-purple-800 mb-6 border-4 border-gray-800 shadow-lg">
            <UserIcon className="w-16 h-16 text-indigo-200" />
          </div>
          <h1 className="text-3xl font-bold text-white">Configuración de Perfil</h1>
          <p className="mt-3 text-lg text-gray-400">
            Administra tu información personal
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {profile.nombreCompleto} {profile.apellidos}
                </h2>
                <p className="text-gray-400 flex items-center gap-1 mt-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  {profile.email}
                </p>
              </div>
              <div className="bg-indigo-900/30 px-3 py-1 rounded-full flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-400 mr-2" />
                <span className="text-indigo-300 text-sm">Verificado</span>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna 1: Información Personal */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
                    <UserIcon className="w-6 h-6 text-indigo-500" />
                    <h3 className="text-xl font-semibold text-gray-200">Información Personal</h3>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Nombre Completo"
                      name="nombreCompleto"
                      value={form.nombreCompleto || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      error={errors.nombreCompleto}
                      icon={<UserIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700 text-white"
                      labelClassName="text-gray-400"
                      inputClassName="text-white"
                    />
                    
                    <Input
                      label="Apellidos"
                      name="apellidos"
                      value={form.apellidos || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      icon={<UserIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700 text-white"
                      labelClassName="text-gray-400"
                      inputClassName="text-white"
                    />
                    
                    <Input
                      label="DNI"
                      value={profile.dni}
                      disabled
                      icon={<IdentificationIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700"
                      labelClassName="text-gray-400"
                      inputClassName="text-gray-400"
                    />
                    
                    <Input
                      label="Fecha de Registro"
                      value={new Date(profile.createdAt).toLocaleDateString()}
                      disabled
                      icon={<CalendarIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700"
                      labelClassName="text-gray-400"
                      inputClassName="text-gray-400"
                    />
                  </div>
                </div>

                {/* Columna 2: Información de Contacto */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
                    <GlobeAltIcon className="w-6 h-6 text-indigo-500" />
                    <h3 className="text-xl font-semibold text-gray-200">Información de Contacto</h3>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Correo Electrónico"
                      value={profile.email}
                      disabled
                      icon={<EnvelopeIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700"
                      labelClassName="text-gray-400"
                      inputClassName="text-gray-400"
                    />
                    
                    <Input
                      label="Teléfono"
                      name="telefono"
                      value={form.telefono || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      error={errors.telefono}
                      icon={<PhoneIcon className="w-5 h-5 text-gray-500" />}
                      maxLength={9}
                      className="bg-gray-800 border-gray-700 text-white"
                      labelClassName="text-gray-400"
                      inputClassName="text-white"
                    />
                    
                    <Input
                      label="Dirección"
                      name="direccion"
                      value={form.direccion || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      icon={<HomeIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700 text-white"
                      labelClassName="text-gray-400"
                      inputClassName="text-white"
                    />
                    
                    <Input
                      label="Nombre de Usuario"
                      value={profile.username}
                      disabled
                      icon={<CogIcon className="w-5 h-5 text-gray-500" />}
                      className="bg-gray-800 border-gray-700"
                      labelClassName="text-gray-400"
                      inputClassName="text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                {editMode ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="min-w-[160px] py-3 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      icon={<XMarkIcon className="w-5 h-5" />}
                    >
                      Cancelar Cambios
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={saving}
                      className="min-w-[160px] py-3 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600"
                      icon={saving ? <Spinner size="sm" /> : <CheckCircleIcon className="w-5 h-5" />}
                    >
                      {saving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="min-w-[180px] py-3 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    icon={<PencilIcon className="w-5 h-5" />}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Mensaje de última actualización */}
        {!editMode && profile.updatedAt && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p className="inline-flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Última actualización: {new Date(profile.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;