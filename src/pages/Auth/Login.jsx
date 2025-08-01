// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Input, Button, Spinner } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import loginImg from '../../assets/parking_img/park_spot.jpg'; // Cambia la ruta a tu imagen
import { EyeFilledIcon, EyeSlashFilledIcon } from '../../components/Auth/Icon/EyeIcons';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      console.log(result); // <-- Agrega esto para depurar
      if (response.ok) {
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result)); // Guarda el usuario completo
        const role = result.roles[0];
        if (role === 'ROLE_ADMIN' || role === 'ROLE_VIGILANTE') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/cliente');
        }
      } else {
        // Personaliza el mensaje de error
        if (result.message === "Bad credentials") {
          setError("Usuario o contraseña incorrectos.");
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error al autenticar. Inténtalo nuevamente.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#0a0c1b]">
      {/* Imagen izquierda */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-transparent">
        <img src={loginImg} alt="Login Illustration" className="max-w-md" />
      </div>
      {/* Formulario derecha */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-12 bg-gray-900">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a ParkSpot 👋</h2>
          <p className="text-gray-400 mb-8">Ingresa tus datos para acceder a tu cuenta.</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="username"
              label="Usuario o Correo"
              placeholder="ejemplo@email.com"
              color="primary"
              variant="bordered"
              className="w-full text-white"
              required
            />
            <Input
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            color="primary"
            variant="bordered"
            className="w-full text-white"
            required
            endContent={
                <button
                type="button"
                className="focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                >
                {showPassword ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
                </button>
            }
            />
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
            <Button
              type="submit"
              color="primary"
              variant="solid"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" color="white" /> : 'Iniciar sesión'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
