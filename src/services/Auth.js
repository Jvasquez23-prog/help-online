export const login = async (credentials) => {
  try {
    const res = await fetch('http://localhost:5000/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'La cédula o contraseña no es válida');
    }

    return data;
  } catch (error) {
    throw error;
  }
};