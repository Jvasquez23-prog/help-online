import { useNavigate } from 'react-router-dom';

import '../assets/css/Login.css';

export default function Login() {
  const navigate = useNavigate('');

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-message">
          <h1>¡Bienvenido!</h1>
          <p>Inicia sesión para explorar tus consultas y medicamentos</p>
        </div>
        <div className="login-form-container">
          <form>
            <input type="text" placeholder="Cédula" />
            <input type="password" placeholder="Contraseña" />
            <input type="submit" value="Iniciar Sesión" />
          </form>
          <div className="login-sign-up">
            <p>¿No tienes cuenta? <b onClick={() => navigate('/Register')}>Regístrate</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}
