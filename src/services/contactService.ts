import { api } from '../lib/api';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export const submitContact = async (payload: ContactPayload) => {
  const { data } = await api.post('/contact', payload);
  return data;
};

export type ContactMessage = ContactPayload & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchMessages = async () => {
  const { data } = await api.get<{ data: ContactMessage[] }>('/contact');
  return data.data;
};

export const deleteMessage = async (id: string) => {
  await api.delete(`/contact/${id}`);
};
