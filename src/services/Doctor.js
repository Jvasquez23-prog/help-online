export const setData = async (formData) => {
  try {
    const res = await fetch('http://localhost:5000/Doctores', {
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
  } catch (error) {
    throw error;
  }
};

export const updateData = async (idDoc, formData) => {
  const res = await fetch(`http://localhost:5000/Doctores/${idDoc}`, {
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

export const deleteData = async (idDoc) => {
  const res = await fetch(`http://localhost:5000/Doctores/${idDoc}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Hubo un error al eliminar');
  }

  return data;
};
