// src/pages/Reservas.jsx
import React from 'react';
import {Button} from "@heroui/react";
import { useNavigate } from 'react-router-dom';

function Reservas() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl mb-4">Reservar Estacionamiento parkspot de moises y no es la rama ramanicol </h2>
      <p>Elige una opción para reservar tu espacio de estacionamiento.</p>

      {/* Ejemplo de botón para continuar con la reserva */}
      <Button 
        variant="ghost"
        color="primary"
        className="mt-6"
        onClick={() => navigate('/confirmar-reserva')}
      >
        Confirmar Reserva
      </Button >
      
    </div>
  );
}

export default Reservas;
