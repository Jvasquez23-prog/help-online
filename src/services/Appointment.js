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

export async function getData(cedula) {
  const url = `http://localhost:5000/Citas?cedula=${encodeURIComponent(cedula)}`;

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