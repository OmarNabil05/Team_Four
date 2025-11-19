import { api } from '../lib/api';
import type { Reservation, ReservationInput, ReservationStatus, Table, AvailableTableSearch } from '../types';

export const createReservation = async (payload: ReservationInput) => {
  const { data } = await api.post<{ data: Reservation }>('/reservations', payload);
  return data.data;
};

export const fetchReservations = async () => {
  const { data } = await api.get<{ data: Reservation[] }>('/reservations');
  return data.data;
};

export const updateReservationStatus = async (id: string, status: ReservationStatus) => {
  const { data } = await api.patch<{ data: Reservation }>(`/reservations/${id}/status`, { status });
  return data.data;
};

export const deleteReservation = async (id: string) => {
  await api.delete(`/reservations/${id}`);
};

export const fetchAvailableTables = async (search: AvailableTableSearch) => {
  const { data } = await api.get<{ data: Table[] }>('/tables/available', { params: search });
  return data.data;
};

export const confirmReservation = async (tableId: string, payload: ReservationInput) => {
  const { data } = await api.post<{ data: Reservation }>(`/tables/${tableId}/reserve`, payload);
  return data.data;
};

export const fetchUserReservations = async (userId: string) => {
  // NOTE: This is a placeholder. In a real app, the userId would likely be fetched from the auth context.
  // For now, we'll assume the API can infer the user from the session/token, or we'll pass a dummy ID.
  const id = userId || 'current_user_id'; 
  const { data } = await api.get<{ data: Reservation[] }>(`/users/${id}/reservations`);
  return data.data;
};

export const updateReservation = async (id: string, payload: Partial<ReservationInput>) => {
  const { data } = await api.patch<{ data: Reservation }>(`/reservations/${id}`, payload);
  return data.data;
};