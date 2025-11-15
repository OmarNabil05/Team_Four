import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import env from '../config/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const message = (error.response.data as { message?: string } | undefined)?.message ??
        'Request failed';
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error('No response received from server'));
    }
    return Promise.reject(error);
  },
);
