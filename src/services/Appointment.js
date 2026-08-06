export const setData = async (formData) => {
  const res = await fetch('http://localhost:5000/Citas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Hubo un error en el registro');
  }

  return data;
};

export async function getData(cedula, idDoc) {
  const params = new URLSearchParams();
  if (cedula) {
    params.append('cedula', cedula);
  }
  if (idDoc) {
    params.append('idDoc', idDoc);
  }

  const url = `http://localhost:5000/Citas?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

export async function getDoctorByCedula(cedula) {
  const url = `http://localhost:5000/Doctores?cedula=${encodeURIComponent(cedula)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateEstado(idCita, cedulaDoc, estado) {
  const res = await fetch('http://localhost:5000/Citas/estado', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idCita, cedulaDoc, estado }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Hubo un error al actualizar la cita');
  }

  return data;
}

export async function getDoctors(area) {
  const url = area
    ? `http://localhost:5000/Doctores?area=${encodeURIComponent(area)}`
    : 'http://localhost:5000/Doctores';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}