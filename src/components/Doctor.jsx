import { useState } from 'react';

import '../assets/css/Doctor.css';

const Office = () => {
  return (
    <div className="office">
      <div className="office-container">
        <div className="office-message">
          <h3>Gestión de Médicos</h3>
          <p>Solicita médicos para trabajar en su área especializada</p>
        </div>

        <form>
          <input type="text" placeholder="Cédula" />
        </form>

        <div className="office-medicaments">
          <div className="office-medicaments-container">
            <div className="office-medicament-item">
              <h1>Acéptaminofen</h1>
              <form>
                <input type="text" placeholder="Cantidad" />
                <input type="text" placeholder="Dosis" />
                <input type="text" placeholder="Frencuencia" />
                <input type="date" placeholder="Fecha de Vencimiento" />
                <input type="submit" value="Agregar"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Doctor() {
  const [activeSection, setActiveSection] = useState('office');

  return (
    <div className="doctor">
      <div className="doctor-container">
        <div className="doctor-header">
          <h1>Help Online</h1>
          <p>Bienvenido a nuestro sistema, <b></b></p>
          <span>🥼</span>
        </div>

        <div className="doctor-navbar">
          <button className={activeSection === 'appointment' ? 'active' : ''} onClick={() => setActiveSection('office')}>Consultorio</button>
        </div>

        <div className="doctor-content">
          {activeSection === 'office' && <Office />}
        </div>
      </div>
    </div>
  );
}
