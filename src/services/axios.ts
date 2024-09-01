import axios from 'axios';

const VITE_BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL && `https://${import.meta.env.VITE_BACKEND_URL}`) || `http://${location.hostname}`;
const VITE_BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8080';

const backendUrl = `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}`;
console.log('backendUrl', backendUrl);

const instance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
