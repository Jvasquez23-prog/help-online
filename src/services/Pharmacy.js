const PHARMACY_NAMES = [
  'Farmacia Central',
  'Farmacia La Salud',
  'Farmacia El Bienestar',
  'Farmacia San Rafael',
  'Farmacia Vida Sana',
  'Farmacia del Valle',
  'Farmacia Santa Lucía',
  'Farmacia Mi Barrio',
  'Farmacia 24 Horas',
  'Farmacia Los Ángeles',
];

const STREETS = [
  'Av. Central',
  'Calle 3',
  'Av. Principal',
  'Calle 5',
  'Av. Las Américas',
  'Calle 8',
  'Av. Norte',
  'Calle 12',
  'Av. Sur',
  'Calle 15',
];

function randomOffset(radiusMeters) {
  const direction = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusMeters;
  return {
    dLat: (distance * Math.cos(direction)) / 111320,
    dLon: (distance * Math.sin(direction)) / (111320 * Math.cos((21 * Math.PI) / 180)),
  };
}

let cachedPharmacies = null;

export async function getNearbyPharmacies(lat, lon, radius = 3000) {
  if (!cachedPharmacies) {
    cachedPharmacies = PHARMACY_NAMES.map((nombre, index) => {
      const { dLat, dLon } = randomOffset(radius);
      return {
        id: index + 1,
        nombre,
        direccion: STREETS[Math.floor(Math.random() * STREETS.length)] + ` #${Math.floor(Math.random() * 90) + 10}`,
        lat: lat + dLat,
        lon: lon + dLon,
      };
    });
  }

  return cachedPharmacies;
}
