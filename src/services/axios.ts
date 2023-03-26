import axios from 'axios';

// const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    // "X-CSRF-TOKEN": csrfToken,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
