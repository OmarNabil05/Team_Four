import { api } from '../lib/api';
import type { Reservation, ReservationInput, ReservationStatus } from '../types';

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
