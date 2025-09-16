import axios from 'axios';

const instance = axios.create({
  //baseURL: 'https://requestapp-back.d8ieii.easypanel.host/',
  baseURL: 'http://localhost:3001/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
