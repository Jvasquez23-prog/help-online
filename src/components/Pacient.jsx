import { useState, useEffect, useRef } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { getNearbyPharmacies } from '../services/Pharmacy.js';

import 'leaflet/dist/leaflet.css';
import '../assets/css/Pacient.css';

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
