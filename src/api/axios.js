import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://requestapp-back.d8ieii.easypanel.host/', // reemplaza con tu URL real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
