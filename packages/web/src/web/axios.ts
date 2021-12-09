import { default as defaultAxios } from 'axios';

export const axiosClient = defaultAxios.create({
  baseURL: '/api'
});
