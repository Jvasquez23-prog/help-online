import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { getData } from '../services/Administrator.js';

import '../assets/css/Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [administrator, setAdministrator] = useState([]);
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getData()
      .then(data => {
        setAdministrator(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleCedulaChange = (e) => {
    const valor = e.target.value;
    
    if (/^\d{0,9}$/.test(valor)) {
      setCedula(valor);
    }
  };

  const validateCedula = (cedula) => {
    return cedula.length === 9 && /^\d{9}$/.test(cedula);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateCedula(cedula)) {
      setError('La cédula debe contener únicamente 9 digitos');
      return;
    }

    const usuarioEncontrado = administrator.find(
      admin => admin.cedula === cedula
    );

    if (!usuarioEncontrado) {
      setError('La cédula o contraseña no es válida');
      return;
    }

    if (usuarioEncontrado.contrasena !== contrasena) {
      setError('La cédula o contraseña no es válida');
      return;
    }

    navigate('/Administrator');
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-message">
          <h1>¡Bienvenido!</h1>
          <p>Inicia sesión para explorar tus consultas y medicamentos</p>
        </div>
        <div className="login-form-container">
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Cédula"
              value={cedula}
              onChange={handleCedulaChange}
              maxLength="9"
              required
            />
            <input 
              type="password" 
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <input type="submit" value="Iniciar Sesión" />
          </form>
          <div className="login-sign-up">
            <p>¿No tienes cuenta? <b onClick={() => navigate('/Register')}>Regístrate</b></p>
          </div>
          {error && (
            <div className="login-error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}