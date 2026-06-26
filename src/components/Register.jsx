import { useNavigate } from 'react-router-dom';

import '../assets/css/Register.css';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-message">
          <h1>¡Regístrate!</h1>
          <p>Solicita tus citas de manera sencilla</p>
        </div>
        <div className="register-form-container">
          <form>
            <input type="text" placeholder="Nombre" />
            <input type="text" placeholder="Primer Apellido" />
            <input type="text" placeholder="Segundo Apellido" />
            <input type="text" placeholder="Cédula" />
            <input type="text" placeholder="Edad" />
            <input type="password" placeholder="Contraseña" />
            <input type="submit" value="Regístrate" />
          </form>
          <div className="register-sign-in">
             <p>¿Ya tienes cuenta? <b onClick={() => navigate('/')}>Iniciar Sesión</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}
