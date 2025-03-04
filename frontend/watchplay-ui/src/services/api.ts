import axios from 'axios';

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const playlistApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLAYLIST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT ao cabeçalho de autorização
const setAuthToken = (token: string | null) => {
  if (token) {
    playlistApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete playlistApi.defaults.headers.common['Authorization'];
  }
};

export { authApi, playlistApi, setAuthToken };
