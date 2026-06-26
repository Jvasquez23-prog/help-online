import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setData } from '../services/Pacient.js';

import '../assets/css/Register.css';

export default function Register() {
  const navigate = useNavigate();


  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    p_apellido: '',
    s_apellido: '',
    cedula: '',
    edad: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(value)) {
        return;
      }
    }

    if (name === 'p_apellido') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]*$/.test(value)) {
        return;
      }
    }

    if (name === 's_apellido') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]*$/.test(value)) {
        return;
      }
    }

    if (name === 'cedula') {
      if (!/^\d{0,9}$/.test(value)) {
        return;
      }
    }

    if (name === 'edad') {
      if (!/^\d{0,9}$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateCedula = (cedula) => {
    return cedula.length === 9 && /^\d{9}$/.test(cedula);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateCedula(formData.cedula)) {
      setError('La cédula debe contener únicamente 9 digitos');
      return;
    }

    const edadNumero = parseInt(formData.edad, 10);
    if (isNaN(edadNumero) || edadNumero < 18 || edadNumero > 100) {
      setError('La edad debe ser un número entre 18 y 100 años');
      return;
    }

    try {
      await setData(formData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-message">
          <h1>¡Regístrate!</h1>
          <p>Solicita tus citas de manera sencilla</p>
        </div>
        <div className="register-form-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="p_apellido"
              placeholder="Primer Apellido"
              value={formData.p_apellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="s_apellido"
              placeholder="Segundo Apellido"
              value={formData.s_apellido}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={formData.cedula}
              onChange={handleChange}
              maxLength={9}
              required
            />
            <input
              type="text"
              name="edad"
              placeholder="Edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
            <input
              type="submit"
              value="Regístrate"
            />
          </form>
          <div className="register-sign-in">
            <p>¿Ya tienes cuenta? <b onClick={() => navigate('/')}>Iniciar Sesión</b></p>
          </div>
          {error && (
            <div className="register-error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}