export async function getData() {
  const url = 'http://localhost:5000/Pacientes';
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