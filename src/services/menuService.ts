import { api } from '../lib/api';
import type { MenuItem } from '../types';

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const { data } = await api.get<{ data: MenuItem[] }>('/menu');
  return data.data;
};
