import { useState, useEffect } from 'react';

import { getData as getPacientData } from '../services/Pacient.js';
import { setData as setConsultaData } from '../services/Consult.js';
import { getData as getMedicamentoData } from '../services/Medicine.js';
import { getDoctorByCedula, getData as getCitasData, updateEstado } from '../services/Appointment.js';

import '../assets/css/Doctor.css';

const formatDate = (fechaCita) => {
  const date = new Date(fechaCita);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleString('es-CR', options);
};

const ConsultaForm = ({ patient, user }) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [formData, setFormData] = useState({
    idMed: '',
    cantidad: '',
    dosis: '',
    frecuencia: '',
    descripcion: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadMedicamentos = async () => {
      const result = await getMedicamentoData();
      if (result && !result.error) {
        setMedicamentos(result);
      }
    };
    loadMedicamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cantidad' && !/^\d{0,9}$/.test(value)) {
      return;
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

    if (!formData.idMed) {
      setError('Debe seleccionar un medicamento');
      return;
    }

    const cantidadNumero = parseInt(formData.cantidad, 10);
    if (isNaN(cantidadNumero) || cantidadNumero < 1) {
      setError('La cantidad debe ser un número mayor a 0');
      return;
    }

    if (!formData.dosis.trim()) {
      setError('Debe ingresar la dosis');
      return;
    }

    if (!formData.frecuencia.trim()) {
      setError('Debe ingresar la frecuencia');
      return;
    }

    try {
      await setConsultaData({
        cedula: patient.cedula,
        cedulaDoc: user.cedula,
        idMed: formData.idMed,
        cantidad: cantidadNumero,
        dosis: formData.dosis.trim(),
        frecuencia: formData.frecuencia.trim(),
        descripcion: formData.descripcion.trim()
      });
      setSuccess('Consulta registrada exitosamente');
      setFormData({
        idMed: '',
        cantidad: '',
        dosis: '',
        frecuencia: '',
        descripcion: ''
      });
    } catch (error) {
      setError(error.message || 'No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="office-medicaments">
      <div className="office-medicaments-container">
        <div className="office-medicament-item visible">
          <form onSubmit={handleSubmit}>
            <select name="idMed" value={formData.idMed} onChange={handleChange} required>
              <option value="">Seleccionar Medicamento</option>
              {medicamentos.map((medicamento) => (
                <option key={medicamento.idMed} value={medicamento.idMed}>
                  {medicamento.nombre}
                </option>
              ))}
            </select>
            <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} maxLength={9} required />
            <input type="text" name="dosis" placeholder="Dosis" value={formData.dosis} onChange={handleChange} required />
            <input type="text" name="frecuencia" placeholder="Frecuencia" value={formData.frecuencia} onChange={handleChange} required />
            <textarea name="descripcion" rows="8" cols="0" placeholder="Descripción" value={formData.descripcion} onChange={handleChange}></textarea>
            <input type="submit" value="Agregar" />
          </form>
        </div>
        {error && (
          <div className="office-error">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="office-success">
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Consultorio = () => {
  const [cedula, setCedula] = useState('');
  const [patient, setPatient] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('helpOnlineUser') || '{}');

  useEffect(() => {
    const loadDoctor = async () => {
      const result = await getDoctorByCedula(user.cedula);
      if (result && !result.error && result.length > 0) {
        setDoctorId(result[0].idDoc);
      }
    };
    loadDoctor();
  }, []);

  const loadCitas = async () => {
    const citasResult = await getCitasData(cedula, doctorId);
    if (citasResult && !citasResult.error) {
      setCitas(citasResult);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setCitas([]);
    setPatient(null);

    if (!/^\d{9}$/.test(cedula)) {
      setError('La cédula debe contener únicamente 9 dígitos');
      return;
    }

    if (!doctorId) {
      setError('No se pudo identificar al doctor conectado');
      return;
    }

    setLoading(true);
    const result = await getPacientData(cedula);
    setLoading(false);

    if (result && !result.error && result.length > 0) {
      setPatient(result[0]);
      await loadCitas();
    } else {
      setError('El paciente no se encuentra registrado');
    }
  };

  const canApprove = citas.some((cita) => String(cita.estado).toLowerCase() === 'aprobada');

  return (
    <div className="office">
      <div className="office-container">
        <div className="office-message">
          <h3>Consultorio</h3>
          <p>Busque al paciente para registrar su consulta</p>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Cédula del Paciente"
            value={cedula}
            onChange={(e) => {
              if (/^\d{0,9}$/.test(e.target.value)) {
                setCedula(e.target.value);
              }
            }}
            maxLength={9}
            required
          />
          <input type="submit" value={loading ? 'Buscando...' : 'Buscar'} disabled={loading} />
        </form>

        {error && (
          <div className="office-error">
            <p>{error}</p>
          </div>
        )}

        {patient && (
          <div className="office-patient-info">
            <p>Paciente: {patient.nombre} {patient.p_apellido} {patient.s_apellido} <br/> Cédula: {patient.cedula}</p>
          </div>
        )}

        {patient && citas.length > 0 && (
          <div className="consult-list">
            {citas.map((cita) => (
              <div key={cita.idCita} className="consult-item">
                <div className="consult-item-info">
                  <p><b>Área:</b> {cita.area}</p>
                  <p><b>Fecha:</b> {formatDate(cita.fecha_cita)}</p>
                  <p><b>Doctor:</b> {cita.doctor}</p>
                </div>
                <span className={`consult-status ${String(cita.estado).toLowerCase()}`}>
                  {cita.estado}
                </span>
              </div>
            ))}
          </div>
        )}

        {patient && citas.length > 0 && !canApprove && (
          <div className="office-error consult-block">
            <p>No se puede registrar la consulta: el paciente no tiene una cita en estado aprobada.</p>
          </div>
        )}

        {patient && citas.length === 0 && (
          <div className="office-error consult-block">
            <p>El paciente no tiene citas registradas con usted.</p>
          </div>
        )}

        {patient && canApprove && <ConsultaForm patient={patient} user={user} />}
      </div>
    </div>
  );
}

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('helpOnlineUser') || '{}');

  useEffect(() => {
    const load = async () => {
      const doc = await getDoctorByCedula(user.cedula);
      if (doc && !doc.error && doc.length > 0) {
        setDoctorId(doc[0].idDoc);
        const citasResult = await getCitasData(null, doc[0].idDoc);
        if (citasResult && !citasResult.error) {
          setCitas(citasResult);
        }
      } else {
        setError('No se pudo identificar al doctor conectado');
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleEstado = async (idCita, estado) => {
    setError('');
    setMsg('');
    try {
      await updateEstado(idCita, user.cedula, estado);
      setMsg(estado === 'Aprobada' ? 'Cita aprobada exitosamente' : 'Cita rechazada exitosamente');
      const citasResult = await getCitasData(null, doctorId);
      if (citasResult && !citasResult.error) {
        setCitas(citasResult);
      }
    } catch (error) {
      setError(error.message || 'No se pudo actualizar la cita');
    }
  };

  return (
    <div className="office">
      <div className="office-container">
        <div className="office-message">
          <h3>Gestión de Citas</h3>
          <p>Apruebe o rechace las citas solicitadas por los pacientes</p>
        </div>

        {loading && <div className="gestion-citas-loading">Cargando citas...</div>}

        {error && (
          <div className="office-error">
            <p>{error}</p>
          </div>
        )}
        {msg && (
          <div className="office-success">
            <p>{msg}</p>
          </div>
        )}

        {!loading && !error && citas.length === 0 && (
          <div className="office-error consult-block">
            <p>No hay citas solicitadas para usted.</p>
          </div>
        )}

        {citas.length > 0 && (
          <div className="consult-list">
            {citas.map((cita) => (
              <div key={cita.idCita} className="consult-item">
                <div className="consult-item-info">
                  <p><b>Paciente:</b> {cita.paciente}</p>
                  <p><b>Área:</b> {cita.area}</p>
                  <p><b>Fecha:</b> {formatDate(cita.fecha_cita)}</p>
                  <p><b>Doctor:</b> {cita.doctor}</p>
                </div>
                <span className={`consult-status ${String(cita.estado).toLowerCase()}`}>
                  {cita.estado}
                </span>
                {String(cita.estado).toLowerCase() === 'programada' && (
                  <div className="consult-actions">
                    <button type="button" onClick={() => handleEstado(cita.idCita, 'Aprobada')}>Aprobar</button>
                    <button type="button" onClick={() => handleEstado(cita.idCita, 'Rechazada')}>Rechazar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Doctor() {
  const [activeSection, setActiveSection] = useState('consultorio');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('helpOnlineUser');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName([parsed.nombre, parsed.p_apellido, parsed.s_apellido].filter(Boolean).join(' '));
    }
  }, []);

  return (
    <div className="doctor">
      <div className="doctor-container">
        <div className="doctor-header">
          <h1>Help Online</h1>
          <p>Bienvenido a nuestro sistema, <b>{userName}</b></p>
          <span>Doctor 🥼</span>
        </div>

        <div className="doctor-navbar">
          <button className={activeSection === 'consultorio' ? 'active' : ''} onClick={() => setActiveSection('consultorio')}>Consultorio</button>
          <button className={activeSection === 'gestion' ? 'active' : ''} onClick={() => setActiveSection('gestion')}>Gestión de Citas</button>
        </div>

        <div className="doctor-content">
          {activeSection === 'consultorio' && <Consultorio />}
          {activeSection === 'gestion' && <GestionCitas />}
        </div>
      </div>
    </div>
  );
}