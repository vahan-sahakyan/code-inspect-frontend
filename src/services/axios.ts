import axios from 'axios';

const instance = axios.create({
  baseURL: `http://${location.hostname}:8080`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
