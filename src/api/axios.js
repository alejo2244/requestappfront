import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/', // reemplaza con tu URL real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
