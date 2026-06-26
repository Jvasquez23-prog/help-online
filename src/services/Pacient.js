export const setData = async (formData) => {
  try {
    const res = await fetch('http://localhost:5000/Pacientes', {
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