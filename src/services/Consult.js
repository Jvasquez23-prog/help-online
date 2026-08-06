export const setData = async (formData) => {
  const res = await fetch('http://localhost:5000/Consultas', {
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

export async function getRecetas(cedula) {
  const url = `http://localhost:5000/Recetas?cedula=${encodeURIComponent(cedula)}`;

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