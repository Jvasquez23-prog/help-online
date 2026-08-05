import { useState, useEffect } from 'react';

import { setData } from '../services/Doctor.js';
import { setData as setMedicineData } from '../services/Medicine.js';
import { setData as setAreaData, getData as getAreasData } from '../services/Area.js';

import '../assets/css/Administrator.css';

const InventoryManagement = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
        fecha_entrega: '',
    idArea: ''
  });

  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAreas = async () => {
      const result = await getAreasData();
      if (result && !result.error) {
        setAreas(result);
      }
    };
    loadAreas();
  }, []);

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

    if (!formData.fecha_entrega) {
      setError('Debe seleccionar una fecha de entrega');
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
    fecha_entrega: '',
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
            {areas.map((area) => (
              <option key={area.idArea} value={area.idArea}>
                {area.nombre}
              </option>
            ))}
          </select>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} maxLength={9} required />
          <input type="date" name="fecha_entrega" placeholder="Fecha de Entrega" value={formData.fecha_entrega} onChange={handleChange} required />
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

  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAreas = async () => {
      const result = await getAreasData();
      if (result && !result.error) {
        setAreas(result);
      }
    };
    loadAreas();
  }, []);

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
            {areas.map((area) => (
              <option key={area.idArea} value={area.idArea}>
                {area.nombre}
              </option>
            ))}
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

const AreaManagement = () => {
  const [formData, setFormData] = useState({
    nombre: ''
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

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombre.trim()) {
      setError('Debe ingresar el nombre del área');
      return;
    }

    try {
      await setAreaData(formData);
      setSuccess('Área registrada exitosamente');
      setFormData({ nombre: '' });
    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="area-management">
      <div className="area-management-container">
        <div className="area-management-message">
          <h3>Registro de Áreas de Trabajo</h3>
          <p>Registra las áreas donde trabajan los doctores</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre del Área" value={formData.nombre} onChange={handleChange} required />
          <input type="submit" value="Registrar" />
        </form>
        {error && (
          <div className="area-management-error">
            <p>{error}</p>
          </div>
        )}
{success && (
          <div className="area-management-success">
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Administrator() {
  const [activeSection, setActiveSection] = useState('doctors');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('helpOnlineUser');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName([parsed.nombre, parsed.p_apellido, parsed.s_apellido].filter(Boolean).join(' '));
    }
  }, []);

  return (
    <div className="administrator">
      <div className="administrator-container">
        <div className="administrator-header">
          <h1>Help Online</h1>
          <p>Bienvenido a nuestro sistema, <b>{userName}</b></p>
          <span>Administrador 👨🏻‍💻</span>
        </div>

        <div className="administrator-navbar">
          <button className={activeSection === 'doctors' ? 'active' : ''} onClick={() => setActiveSection('doctors')}>Solicitud de Personal</button>
          <button className={activeSection === 'areas' ? 'active' : ''} onClick={() => setActiveSection('areas')}>Registro de Áreas</button>
          <button className={activeSection === 'inventory' ? 'active' : ''} onClick={() => setActiveSection('inventory')}>Manejo de Inventario</button>
        </div>

        <div className="administrator-content">
          {activeSection === 'doctors' && <RequestDoctors />}
          {activeSection === 'areas' && <AreaManagement />}
          {activeSection === 'inventory' && <InventoryManagement />}
        </div>
      </div>
    </div>
  );
}