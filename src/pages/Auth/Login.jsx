// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl text-center mb-6">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Correo o Usuario"
            fullWidth
            variant="outlined"
            className="mb-4"
            color="primary"
          />
          <TextField
            name="password"
            label="Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            className="mb-4"
            color="primary"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
