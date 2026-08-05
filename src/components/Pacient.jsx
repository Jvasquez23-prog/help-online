import { useState, useEffect, useRef } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { getNearbyPharmacies } from '../services/Pharmacy.js';

import 'leaflet/dist/leaflet.css';
import '../assets/css/Pacient.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const GEMINI_MODEL = 'gemini-flash-latest';

const MEDICAL_AREAS = [
  { id: '1', nombre: 'Cardiología' },
  { id: '2', nombre: 'Dermatología' },
  { id: '3', nombre: 'Oftalmología' },
  { id: '4', nombre: 'Psicología' },
  { id: '5', nombre: 'Paliativos' },
];

const normalizeAreaName = (name) =>
  String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

async function callGemini(payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`La consulta de IA falló (${response.status})`);
  }
  return response.json();
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-marker-icon',
});

const MapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
};

const PharmacyMap = () => {
  const [position, setPosition] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const pharmaciesLoadedRef = useRef(false);

  useEffect(() => {
    const loadLocation = () => {
      if (!navigator.geolocation) {
        setError('Tu navegador no soporta la geolocalización');
        setLoading(false);
        return;
      }

      const success = async (geo) => {
        const lat = geo.coords.latitude;
        const lon = geo.coords.longitude;
        setPosition([lat, lon]);
        if (!pharmaciesLoadedRef.current) {
          try {
            const result = await getNearbyPharmacies(lat, lon);
            setPharmacies(result);
            pharmaciesLoadedRef.current = true;
            if (result.length === 0) {
              setError('No se encontraron farmacias cercanas');
            }
          } catch {
            setError('No se pudieron cargar las farmacias cercanas');
          }
        }
        setLoading(false);
      };

      const error = () => {
        setError('No se pudo obtener tu ubicación');
        setLoading(false);
      };

      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      });
    };

    const watchId = loadLocation();

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <div className="pharmacy-map">
      <div className="pharmacy-map-container">
        <div className="pharmacy-map-message">
          <h3>Mapa de Farmacias</h3>
          <p>Ubicación de las farmacias cercanas a ti</p>
        </div>

        {loading && (
          <div className="pharmacy-map-loading">
            <p>Buscando tu ubicación...</p>
          </div>
        )}

        {error && (
          <div className="pharmacy-map-error">
            <p>{error}</p>
          </div>
        )}

        {position && (
          <div className="pharmacy-map-map">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
              <MapCenter position={position} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={userIcon}>
                <Popup>Tu ubicación (en tiempo real)</Popup>
              </Marker>
              {pharmacies.map((pharmacy) => (
                <Marker key={pharmacy.id} position={[pharmacy.lat, pharmacy.lon]} icon={defaultIcon}>
                  <Popup>
                    <b>{pharmacy.nombre}</b>
                    {pharmacy.direccion && <br />}
                    {pharmacy.direccion}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

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

const MedicalAssistant = ({ areas, onSelectArea }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speak = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const esVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang && voice.lang.toLowerCase().startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleConsult = async () => {
    const padecimiento = query.trim();
    if (!padecimiento) return;

    setLoading(true);
    setError('');
    setInfo('');
    setRecommended([]);

    const areaNames = areas.map((area) => area.nombre).join(', ');
    const systemPrompt =
      'Actúas como un asistente clínico de orientación para un sistema de citas médicas. ' +
      'Responde únicamente en JSON con la estructura indicada en el esquema. ' +
      `Las únicas áreas médicas disponibles en el sistema son: ${areaNames}. ` +
      'En "informacion" entrega una explicación breve y clara del padecimiento (máximo 3 líneas). ' +
      'En "areasRecomendadas" lista SOLO los nombres de las áreas disponibles que mejor atienden ese padecimiento (puede ser un arreglo vacío). ' +
      'Añade siempre una nota de que la consulta es informativa y no sustituye la valoración profesional.';

    const userPrompt =
      `El paciente describe el siguiente padecimiento: "${padecimiento}". ` +
      '¿Qué área o áreas médicas registradas debería seleccionar para su cita y cuál es la información breve del padecimiento?';

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            informacion: { type: 'STRING' },
            areasRecomendadas: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['informacion', 'areasRecomendadas'],
        },
      },
    };

    try {
      const data = await callGemini(payload);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Sin respuesta de IA.');

      const parsed = JSON.parse(text);
      const parsedInfo = parsed.informacion || 'No se pudo generar la información del padecimiento.';
      setInfo(parsedInfo);

      const recommendedNames = Array.isArray(parsed.areasRecomendadas) ? parsed.areasRecomendadas : [];
      const matched = areas.filter((area) =>
        recommendedNames.some((name) => normalizeAreaName(name) === normalizeAreaName(area.nombre))
      );
      setRecommended(matched);

      const speechText =
        matched.length > 0
          ? `${parsedInfo} Te recomiendo solicitar tu cita en el área de ${matched.map((area) => area.nombre).join(', ')}.`
          : `${parsedInfo} No encontré un área específica registrada para tu padecimiento, te sugiero consultar con un especialista.`;
      speak(speechText);
    } catch (err) {
      setError(
        GEMINI_API_KEY
          ? 'No se pudo completar la consulta con Gemini. Revisa tu conexión e intenta nuevamente.'
          : 'Falta la API Key de Gemini. Colócala en el archivo .env (VITE_GEMINI_API_KEY) y reinicia el servidor de desarrollo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-assistant">
      <div className="medical-assistant-header">
        <div className="medical-assistant-icon">⚕️</div>
        <div>
          <h3>Asistente Clínico IA</h3>
          <p>Describe tu padecimiento y te recomiendo el área para tu cita</p>
        </div>
        <button
          type="button"
          className={`medical-assistant-voice ${voiceEnabled ? 'active' : ''}`}
          onClick={() => {
            if (voiceEnabled && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            setVoiceEnabled(!voiceEnabled);
          }}
          title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
        >
          {voiceEnabled ? '🔊 Voz Activada' : '🔇 Voz Desactivada'}
        </button>
      </div>

      <div className="medical-assistant-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleConsult();
            }
          }}
          placeholder="Ej: Me duele el pecho y siento palpitaciones..."
        />
        <button type="button" onClick={handleConsult} disabled={loading || !query.trim()}>
          {loading ? 'Consultando...' : 'Consultar con IA'}
        </button>
      </div>

      {loading && <div className="medical-assistant-loading">El asistente está analizando tu padecimiento...</div>}

      {error && <div className="medical-assistant-error">{error}</div>}

      {info && (
        <div className="medical-assistant-result">
          <h4>Sobre tu padecimiento</h4>
          <p>{info}</p>
          {recommended.length > 0 && (
            <div className="medical-assistant-areas">
              <h4>Área(s) recomendada(s) en el sistema:</h4>
              <div className="medical-assistant-areas-list">
                {recommended.map((area) => (
                  <button key={area.id} type="button" onClick={() => onSelectArea(area.id)}>
                    {area.nombre}
                  </button>
                ))}
              </div>
              <p className="medical-assistant-note">Haz clic en un área para seleccionarla en el formulario.</p>
            </div>
          )}
          <p className="medical-assistant-note">
            Esta información es meramente orientativa y no sustituye la valoración de un especialista.
          </p>
        </div>
      )}
    </div>
  );
}

const RequestAppointment = () => {
  const [area, setArea] = useState('');
  const [doctor, setDoctor] = useState('');

  return (
    <div className="request-appointment">
      <div className="request-appointment-container">
        <div className="request-appointment-message">
          <h3>Solicitud de Citas</h3>
          <p>Solicita tu cita con el doctor especializado de tu preferencia</p>
        </div>

        <form>
          <MedicalAssistant areas={MEDICAL_AREAS} onSelectArea={setArea} />
          <select name="area" value={area} onChange={(e) => setArea(e.target.value)} required>
            <option value="">Seleccionar Área</option>
            {MEDICAL_AREAS.map((medicalArea) => (
              <option key={medicalArea.id} value={medicalArea.id}>
                {medicalArea.nombre}
              </option>
            ))}
          </select>
          <select name="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
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
          <button className={activeSection === 'map' ? 'active' : ''} onClick={() => setActiveSection('map')}>Farmacias</button>
        </div>

        <div className="pacient-content">
          {activeSection === 'appointment' && <RequestAppointment />}
          {activeSection === 'lists' && <ListAppointments />}
          {activeSection === 'map' && <PharmacyMap />}
        </div>
      </div>
    </div>
  );
}
