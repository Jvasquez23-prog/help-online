import { useState, useEffect } from 'react';

import { setData, updateData as updateDoctorData, deleteData as deleteDoctorData } from '../services/Doctor.js';
import { setData as setMedicineData, getData as getMedicinesData, updateData as updateMedicineData, deleteData as deleteMedicineData } from '../services/Medicine.js';
import { setData as setAreaData, getData as getAreasData, updateData as updateAreaData, deleteData as deleteAreaData } from '../services/Area.js';
import { getDoctors as getDoctorsData } from '../services/Appointment.js';

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

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const docsResult = await getDoctorsData();
    if (docsResult && !docsResult.error) {
      setDoctors(docsResult);
    }
    const areasResult = await getAreasData();
    if (areasResult && !areasResult.error) {
      setAreas(areasResult);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (doctor) => {
    setError('');
    setSuccess('');
    setEditingId(doctor.idDoc);
    setFormData({
      nombre: doctor.nombre,
      p_apellido: doctor.p_apellido,
      s_apellido: doctor.s_apellido,
      cedula: doctor.cedula,
      idArea: doctor.idArea
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cedula' && !/^\d{0,9}$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateDoctorData(editingId, formData);
      setSuccess('Doctor actualizado exitosamente');
      setEditingId(null);
      load();
    } catch (error) {
      setError(error.message || 'No se pudo actualizar el doctor');
    }
  };

  const handleDelete = async (idDoc) => {
    if (!window.confirm('¿Seguro que deseas eliminar este doctor?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await deleteDoctorData(idDoc);
      setSuccess('Doctor eliminado exitosamente');
      load();
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el doctor');
    }
  };

  return (
    <div className="manage-section">
      <div className="manage-section-header">
        <h4>Doctores</h4>
      </div>
      {error && (
        <div className="manage-error">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="manage-success">
          <p>{success}</p>
        </div>
      )}
      <div className="manage-table-container">
        {doctors.length === 0 ? (
          <div className="manage-empty">No hay doctores registrados.</div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Área</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.idDoc}>
                  {editingId === doctor.idDoc ? (
                    <td colSpan="4">
                      <form className="manage-edit-form" onSubmit={handleUpdate}>
                        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                        <input type="text" name="p_apellido" placeholder="Primer Apellido" value={formData.p_apellido} onChange={handleChange} required />
                        <input type="text" name="s_apellido" placeholder="Segundo Apellido" value={formData.s_apellido} onChange={handleChange} />
                        <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} maxLength={9} required />
                        <select name="idArea" value={formData.idArea} onChange={handleChange} required>
                          <option value="">Seleccionar Área</option>
                          {areas.map((area) => (
                            <option key={area.idArea} value={area.idArea}>
                              {area.nombre}
                            </option>
                          ))}
                        </select>
                        <input type="submit" value="Guardar" />
                        <button type="button" className="manage-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td>{doctor.nombre} {doctor.p_apellido} {doctor.s_apellido}</td>
                      <td>{doctor.cedula}</td>
                      <td>{areas.find((area) => area.idArea === doctor.idArea)?.nombre || doctor.idArea}</td>
                      <td className="manage-actions">
                        <button type="button" onClick={() => startEdit(doctor)}>Editar</button>
                        <button type="button" onClick={() => handleDelete(doctor.idDoc)}>Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const medsResult = await getMedicinesData();
    if (medsResult && !medsResult.error) {
      setMedicines(medsResult);
    }
    const areasResult = await getAreasData();
    if (areasResult && !areasResult.error) {
      setAreas(areasResult);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (medicine) => {
    setError('');
    setSuccess('');
    setEditingId(medicine.idMed);
    setFormData({
      nombre: medicine.nombre,
      cantidad: medicine.cantidad,
      fecha_entrega: medicine.fecha_entrega ? String(medicine.fecha_entrega).slice(0, 10) : '',
      idArea: medicine.idArea
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cantidad' && !/^\d{0,9}$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateMedicineData(editingId, {
        nombre: formData.nombre,
        cantidad: parseInt(formData.cantidad, 10) || null,
        fecha_entrega: formData.fecha_entrega,
        idArea: formData.idArea
      });
      setSuccess('Medicamento actualizado exitosamente');
      setEditingId(null);
      load();
    } catch (error) {
      setError(error.message || 'No se pudo actualizar el medicamento');
    }
  };

  const handleDelete = async (idMed) => {
    if (!window.confirm('¿Seguro que deseas eliminar este medicamento?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await deleteMedicineData(idMed);
      setSuccess('Medicamento eliminado exitosamente');
      load();
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el medicamento');
    }
  };

  return (
    <div className="manage-section">
      <div className="manage-section-header">
        <h4>Medicamentos</h4>
      </div>
      {error && (
        <div className="manage-error">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="manage-success">
          <p>{success}</p>
        </div>
      )}
      <div className="manage-table-container">
        {medicines.length === 0 ? (
          <div className="manage-empty">No hay medicamentos registrados.</div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Fecha Entrega</th>
                <th>Área</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.idMed}>
                  {editingId === medicine.idMed ? (
                    <td colSpan="5">
                      <form className="manage-edit-form" onSubmit={handleUpdate}>
                        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                        <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} maxLength={9} />
                        <input type="date" name="fecha_entrega" value={formData.fecha_entrega} onChange={handleChange} required />
                        <select name="idArea" value={formData.idArea} onChange={handleChange} required>
                          <option value="">Seleccionar Área</option>
                          {areas.map((area) => (
                            <option key={area.idArea} value={area.idArea}>
                              {area.nombre}
                            </option>
                          ))}
                        </select>
                        <input type="submit" value="Guardar" />
                        <button type="button" className="manage-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td>{medicine.nombre}</td>
                      <td>{medicine.cantidad}</td>
                      <td>{medicine.fecha_entrega ? String(medicine.fecha_entrega).slice(0, 10) : ''}</td>
                      <td>{areas.find((area) => area.idArea === medicine.idArea)?.nombre || medicine.idArea}</td>
                      <td className="manage-actions">
                        <button type="button" onClick={() => startEdit(medicine)}>Editar</button>
                        <button type="button" onClick={() => handleDelete(medicine.idMed)}>Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const ManageAreas = () => {
  const [areas, setAreas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const result = await getAreasData();
    if (result && !result.error) {
      setAreas(result);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (area) => {
    setError('');
    setSuccess('');
    setEditingId(area.idArea);
    setFormData({ nombre: area.nombre });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateAreaData(editingId, { nombre: formData.nombre });
      setSuccess('Área actualizada exitosamente');
      setEditingId(null);
      load();
    } catch (error) {
      setError(error.message || 'No se pudo actualizar el área');
    }
  };

  const handleDelete = async (idArea) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta área?')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await deleteAreaData(idArea);
      setSuccess('Área eliminada exitosamente');
      load();
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el área');
    }
  };

  return (
    <div className="manage-section">
      <div className="manage-section-header">
        <h4>Áreas</h4>
      </div>
      {error && (
        <div className="manage-error">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="manage-success">
          <p>{success}</p>
        </div>
      )}
      <div className="manage-table-container">
        {areas.length === 0 ? (
          <div className="manage-empty">No hay áreas registradas.</div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.idArea}>
                  {editingId === area.idArea ? (
                    <td colSpan="2">
                      <form className="manage-edit-form" onSubmit={handleUpdate}>
                        <input type="text" name="nombre" placeholder="Nombre del Área" value={formData.nombre} onChange={handleChange} required />
                        <input type="submit" value="Guardar" />
                        <button type="button" className="manage-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td>{area.nombre}</td>
                      <td className="manage-actions">
                        <button type="button" onClick={() => startEdit(area)}>Editar</button>
                        <button type="button" onClick={() => handleDelete(area.idArea)}>Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const ManageRecords = () => {
  const [tab, setTab] = useState('doctors');

  return (
    <div className="manage-records">
      <div className="manage-records-container">
        <div className="manage-records-message">
          <h3>Gestión de Registros</h3>
          <p>Actualice o elimine doctores, medicamentos y áreas</p>
        </div>

        <div className="manage-tabs">
          <button className={tab === 'doctors' ? 'active' : ''} onClick={() => setTab('doctors')}>Doctores</button>
          <button className={tab === 'medicines' ? 'active' : ''} onClick={() => setTab('medicines')}>Medicamentos</button>
          <button className={tab === 'areas' ? 'active' : ''} onClick={() => setTab('areas')}>Áreas</button>
        </div>

        {tab === 'doctors' && <ManageDoctors />}
        {tab === 'medicines' && <ManageMedicines />}
        {tab === 'areas' && <ManageAreas />}
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
          <button className={activeSection === 'manage' ? 'active' : ''} onClick={() => setActiveSection('manage')}>Gestión de Registros</button>
        </div>

        <div className="administrator-content">
          {activeSection === 'doctors' && <RequestDoctors />}
          {activeSection === 'areas' && <AreaManagement />}
          {activeSection === 'inventory' && <InventoryManagement />}
          {activeSection === 'manage' && <ManageRecords />}
        </div>
      </div>
    </div>
  );
}