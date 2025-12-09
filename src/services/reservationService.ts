import env from '../config/env';
import type { TableItem, Reservation, ReservationInput } from '../types';




// جلب كل الطاولات
export const fetchTables = async (): Promise<TableItem[]> => {
  const res = await fetch(`${env.apiUrl}/tables`);
  if (!res.ok) throw new Error('Failed to fetch tables');
  const data = await res.json();

  return data.map((item: {
    _id: string;
    name: string;
    category: string;
    maxSeats: number;
    reserved: boolean;
  }) => ({
    _id: item._id,
    name: item.name,
    category: item.category,
    maxSeats: item.maxSeats,
    reserved: item.reserved,
    isAvailable: !item.reserved,
  }));
};

// جلب حجوزات المستخدم
export const fetchUserReservations = async (userId: string): Promise<Reservation[]> => {
  const res = await fetch(`${env.apiUrl}/reservations?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch reservations');
  const data = await res.json();
  return data;
};


// تأكيد حجز
export const confirmReservation = async (
  tableId: string,
  reservationData: ReservationInput
): Promise<void> => {
  const bodyToSend = {
    tableId,
    customerName: reservationData.customerName,
    timeStart: reservationData.timeStart,
    durationMinutes: 120, 
    peopleCount: reservationData.peopleCount,
    message: reservationData.message,
    status: reservationData.status,
  };

  const res = await fetch(`${env.apiUrl}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyToSend),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to confirm reservation: ${errText}`);
  }
};




export const updateReservation = async (reservationId: string, reservationData: Partial<ReservationInput> & { durationMinutes?: number }): Promise<void> => {
  const res = await fetch(`${env.apiUrl}/reservations/${reservationId}`, {
    method: 'PUT', // أو PATCH حسب الباك
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update reservation: ${errorText}`);
  }
};
export const cancelReservation = async (reservationId: string): Promise<void> => {
  const res = await fetch(`${env.apiUrl}/reservations/${reservationId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to cancel reservation: ${errorText}`);
  }
};