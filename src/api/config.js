import { HTTPError } from '@components';

const API_URL = process.env.API_URL;
const TOKEN = sessionStorage.getItem('my-token');

function init(method, body) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  if (body instanceof FormData) delete headers['Content-Type'];
  if (!(body instanceof FormData)) body = JSON.stringify(body);

  return {
    method,
    headers,
    body,
  };
}

const api = {
  get: async (url) => {
    try {
      const response = await fetch(API_URL + url, init('GET'));

      if (response.ok) return await response.json();
      else throw await response.json();
    } catch (error) {
      throw new HTTPError(error);
    }
  },

  post: async (url, body) => {
    try {
      const response = await fetch(API_URL + url, init('POST', body));

      if (response.ok) return await response.json();
      else throw await response.json();
    } catch (error) {
      throw new HTTPError(error);
    }
  },

  delete: async (url) => {
    try {
      const response = await fetch(API_URL + url, init('DELETE'));

      if (response.ok) return await response.json();
      else throw await response.json();
    } catch (error) {
      throw new HTTPError(error);
    }
  },
};

export default api;
