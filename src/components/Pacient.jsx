import { useState } from 'react';

import '../assets/css/Pacient.css';

const ListAppointments = () => {
  return (
    <div className="list-appointment">
      <div className="list-appointment-container">
        <div className="list-appointment-message">
          <h3>Listado de Citas</h3>
          <p>Mira todas tus citas programadas</p>
        </div>

        <div className="list-appointment-item">
          <div className="list-appointment-item-container">
            <div className="list-appointment-header">
              <h1>Cita #001</h1>
            </div>
            <div className="list-appointment-body">
              <div className="list-appointment-body-item">
                <h3>ID:</h3>
                <p>000001</p>
              </div>
              <div className="list-appointment-body-item">
                <h3>Doctor:</h3>
                <p>Catherine Paola Pérez Sánchez</p>
              </div>
              <div className="list-appointment-body-item">
                <h3>Área:</h3>
                <p>Cardiología</p>
              </div>
              <div className="list-appointment-body-item">
                <h3>Estado:</h3>
                <p>Aprobado</p>
              </div>
              <div className="list-appointment-body-item">
                <h3>Fecha de Solicitud:</h3>
                <p>12/02/2026</p>
              </div>
              <div className="list-appointment-body-item">
                <h3>Cita Programada:</h3>
                <p>12/03/2026</p>
              </div>
              <button>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RequestAppointment = () => {
  return (
    <div className="request-appointment">
      <div className="request-appointment-container">
        <div className="request-appointment-message">
          <h3>Solicitud de Citas</h3>
          <p>Solicita tu cita con el doctor especializado de tu preferencia</p>
        </div>

        <form>
          <select>
            <option value="">Seleccionar Área</option>
          </select>
          <select>
            <option value="">Seleccionar Doctor</option>
          </select>
          <input type="submit" value="Solicitar" />
        </form>
      </div>
    </div>
  );
}

export default function Pacient() {
  const [activeSection, setActiveSection] = useState('appointment');

  return (
    <div className="pacient">
      <div className="pacient-container">
        <div className="pacient-header">
          <h1>Help Online</h1>
          <p>Bienvenido a nuestro sistema, <b></b></p>
          <span>👋🏻</span>
        </div>

        <div className="pacient-navbar">
          <button className={activeSection === 'appointment' ? 'active' : ''} onClick={() => setActiveSection('appointment')}>Solicitud Citas</button>
          <button className={activeSection === 'lists' ? 'active' : ''} onClick={() => setActiveSection('lists')}>Lista de Citas</button>
        </div>

        <div className="pacient-content">
          {activeSection === 'appointment' && <RequestAppointment />}
          {activeSection === 'lists' && <ListAppointments />}
        </div>
      </div>
    </div>
  );
}
