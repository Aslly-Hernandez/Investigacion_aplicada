const axios = require('axios');
const crypto = require('crypto');

const generateRandomUsername = () => {
  return `user_${crypto.randomBytes(4).toString('hex')}`; // Genera un nombre de usuario aleatorio
};

describe('API Login', () => {
  const url = 'http://localhost:4000/api/login';
  const validCredentials = { user: 'admin', password: '12345' };

  it('Devuelve una respuesta exitosa (200) con credenciales validas', async () => {
    const response = await axios.post(url, validCredentials);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Usuario logeado'); // Cambia según tu respuesta esperada
  });

  it('Devuelve un error (400) con credenciales invalidas ', async () => {
    const invalidCredentials = { user: 'admin', password: 'wrongPassword' };

    try {
      await axios.post(url, invalidCredentials);
    } catch (error) {
      expect(error.response.status).toBe(400); // Cambia según el código de estado esperado
      expect(error.response.data).toHaveProperty('message', 'Contrasena incorrecta'); // Cambia según tu respuesta esperada
    }
  });
});

describe('API Register', () => {
  const url = 'http://localhost:4000/api/register';
  const validCredentials = { user: generateRandomUsername(), email: 'email@email.com', password: 'password' };

  it('Devuelve una respuesta exitosa (201) al crear usuario nuevo', async () => {
    const response = await axios.post(url, validCredentials);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('message', 'Usuario agregado exitosamente'); // Cambia según tu respuesta esperada
  });

  it('Devuelve un error (400) al intentar registrar un usuario ya existente', async () => {

    try {
      await axios.post(url, validCredentials);
    } catch (error) {
      expect(error.response.status).toBe(400); // Cambia según el código de estado esperado
      expect(error.response.data).toHaveProperty('message', 'Este usuario ya se encuentra registrado'); // Cambia según tu respuesta esperada
    }
  });
});

