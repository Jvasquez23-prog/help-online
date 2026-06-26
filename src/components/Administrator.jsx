import { useState } from 'react';

import '../assets/css/Administrator.css';

const InventoryManagement = () => {
  return (
    <div className="inventory-management">
      <div className="inventory-management-container">
        <div className="inventory-management-message">
          <h3>Gestión de Medicamentos</h3>
          <p>Administra completamente el inventario de medicamentos</p>
        </div>

        <form>
          <select>
            <option value="">Seleccionar Área</option>
          </select>
          <select>
            <option value="">Seleccionar Medicamentos</option>
          </select>
          <input type="text" placeholder="Cantidad" />
          <input type="date" placeholder="Fecha de Vencimiento" />
          <input type="submit" value="Enviar" />
        </form>
      </div>
    </div>
  );
}

const RequestDoctors = () => {
  return (
    <div className="request-doctors">
      <div className="request-doctors-container">
        <div className="request-doctors-message">
          <h3>Gestión de Médicos</h3>
          <p>Solicita médicos para trabajar en su área especializada</p>
        </div>

        <form>
          <input type="text" placeholder="Nombre" />
          <input type="text" placeholder="Primer Apellido" />
          <input type="text" placeholder="Segundo Apellido" />
          <input type="text" placeholder="Nacionalidad" />
          <input type="text" placeholder="Cédula" />
          <select>
            <option value="">Seleccionar Área</option>
            <option value="cardiologia">Cardiología</option>
            <option value="dermatologia">Dermatología</option>
            <option value="oftalmologia">Oftalmología</option>
            <option value="psicologia">Psicología</option>
            <option value="paliativo">Paliativos</option>
          </select>
          <input type="submit" value="Solicitar" />
        </form>
      </div>
    </div>
  );
}

export default function Administrator() {
  const [activeSection, setActiveSection] = useState('doctors');

  return (
    <div className="administrator">
      <div className="administrator-container">
        <div className="administrator-header">
          <h1>Help Online</h1>
          <p>Bienvenido a nuestro sistema, <b></b></p>
          <span>👨🏻‍💻</span>
        </div>

        <div className="administrator-navbar">
          <button className={activeSection === 'doctors' ? 'active' : ''} onClick={() => setActiveSection('doctors')}>Solicitud de Personal</button>
          <button className={activeSection === 'inventory' ? 'active' : ''} onClick={() => setActiveSection('inventory')}>Manejo de Inventario</button>
        </div>

        <div className="administrator-content">
          {activeSection === 'doctors' && <RequestDoctors />}
          {activeSection === 'inventory' && <InventoryManagement />}
        </div>
      </div>
    </div>
  );
}
