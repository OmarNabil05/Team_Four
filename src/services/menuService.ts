import { api } from '../lib/api';
import type { MenuItem, MenuItemInput } from '../types';

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const { data } = await api.get<{ data: MenuItem[] }>('/menu');
  return data.data;
};

export const fetchMenuAdmin = async (): Promise<MenuItem[]> => {
  const { data } = await api.get<{ data: MenuItem[] }>('/menu/manage');
  return data.data;
};

export const createMenuItem = async (payload: MenuItemInput) => {
  const { data } = await api.post<{ data: MenuItem }>('/menu', payload);
  return data.data;
};

export const updateMenuItem = async (id: string, payload: Partial<MenuItemInput>) => {
  const { data } = await api.patch<{ data: MenuItem }>(`/menu/${id}`, payload);
  return data.data;
};

export const deleteMenuItem = async (id: string) => {
  await api.delete(`/menu/${id}`);
};
