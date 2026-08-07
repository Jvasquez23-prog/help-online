export const setData = async (formData) => {
  const res = await fetch('http://localhost:5000/Medicamentos', {
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

export async function getData() {
  const url = 'http://localhost:5000/Medicamentos';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

export const updateData = async (idMed, formData) => {
  const res = await fetch(`http://localhost:5000/Medicamentos/${idMed}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Hubo un error al actualizar');
  }

  return data;
};

export const deleteData = async (idMed) => {
  const res = await fetch(`http://localhost:5000/Medicamentos/${idMed}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Hubo un error al eliminar');
  }

  return data;
};
