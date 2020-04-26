export const API_URL = process.env.REACT_APP_API_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export const FETCH_OPTIONS = {
  cache: 'no-cache',
  credentials: 'include',
  mode: 'cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
