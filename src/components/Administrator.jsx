import { useState } from 'react';

import { setData } from '../services/Doctor.js';
import { setData as setMedicineData } from '../services/Medicine.js';

import '../assets/css/Administrator.css';

const InventoryManagement = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    fecha_vencimiento: '',
    idArea: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(value)) {
        return;
      }
    }

    if (name === 'cantidad') {
      if (!/^\d{0,9}$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cantidadNumero = parseInt(formData.cantidad, 10);
    if (isNaN(cantidadNumero) || cantidadNumero < 1) {
      setError('La cantidad debe ser un número mayor a 0');
      return;
    }

    if (!formData.fecha_vencimiento) {
      setError('Debe seleccionar una fecha de vencimiento');
      return;
    }

    if (!formData.idArea) {
      setError('Debe seleccionar un área');
      return;
    }

    try {
      await setMedicineData(formData);
      setSuccess('Medicamento registrado exitosamente');
      setFormData({
        nombre: '',
        cantidad: '',
        fecha_vencimiento: '',
        idArea: ''
      });
    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="inventory-management">
      <div className="inventory-management-container">
        <div className="inventory-management-message">
          <h3>Gestión de Medicamentos</h3>
          <p>Administra completamente el inventario de medicamentos</p>
        </div>

        <form onSubmit={handleSubmit}>
          <select name="idArea" value={formData.idArea} onChange={handleChange} required>
            <option value="">Seleccionar Área</option>
            <option value="1">Cardiología</option>
            <option value="2">Dermatología</option>
            <option value="3">Oftalmología</option>
            <option value="4">Psicología</option>
            <option value="5">Paliativos</option>
          </select>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} maxLength={9} required />
          <input type="date" name="fecha_vencimiento" placeholder="Fecha de Vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} required />
          <input type="submit" value="Enviar" />
        </form>
        {error && (
          <div className="request-doctors-error">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="request-doctors-success">
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const RequestDoctors = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    p_apellido: '',
    s_apellido: '',
    cedula: '',
    contrasena: '',
    idArea: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.cedula.length !== 9 || !/^\d{9}$/.test(formData.cedula)) {
      setError('La cédula debe contener únicamente 9 digitos');
      return;
    }

    if (!formData.idArea) {
      setError('Debe seleccionar un área');
      return;
    }

    try {
      await setData(formData);
      setSuccess('Doctor registrado exitosamente');
      setFormData({
        nombre: '',
        p_apellido: '',
        s_apellido: '',
        cedula: '',
        contrasena: '',
        idArea: ''
      });
    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="request-doctors">
      <div className="request-doctors-container">
        <div className="request-doctors-message">
          <h3>Gestión de Médicos</h3>
          <p>Solicita médicos para trabajar en su área especializada</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="p_apellido" placeholder="Primer Apellido" value={formData.p_apellido} onChange={handleChange} required />
          <input type="text" name="s_apellido" placeholder="Segundo Apellido" value={formData.s_apellido} onChange={handleChange} />
          <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} maxLength={9} required />
          <input type="password" name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} required />
          <select name="idArea" value={formData.idArea} onChange={handleChange} required>
            <option value="">Seleccionar Área</option>
            <option value="1">Cardiología</option>
            <option value="2">Dermatología</option>
            <option value="3">Oftalmología</option>
            <option value="4">Psicología</option>
            <option value="5">Paliativos</option>
          </select>
          <input type="submit" value="Solicitar" />
        </form>
        {error && (
          <div className="request-doctors-error">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="request-doctors-success">
            <p>{success}</p>
          </div>
        )}
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