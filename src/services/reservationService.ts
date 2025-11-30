import env from '../config/env';
import type { TableItem, Reservation, ReservationInput } from '../types';




// جلب كل الطاولات
export const fetchTables = async (): Promise<TableItem[]> => {
  const res = await fetch(`${env.apiUrl}/tables`);
  if (!res.ok) throw new Error('Failed to fetch tables');
  const data = await res.json();

  return data.map((item: any) => ({
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
  const timeStartIso = new Date(
    `${reservationData.date}T${reservationData.time}:00`
  ).toISOString();

  const bodyToSend = {
    tableId,
    customerName: reservationData.name, // مهم جداً
    timeStart: timeStartIso,
    durationMinutes: 120, // ثابت أو من reservationData لو عندك
    peopleCount: reservationData.guests, // مهم جداً
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




export const updateReservation = async (reservationId: string, reservationData: ReservationInput): Promise<void> => {
  const res = await fetch(`${env.apiUrl}/reservations/${reservationId}`, {
    method: 'PUT', // أو PATCH حسب الباك
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });

  if (!res.ok) throw new Error('Failed to update reservation');
};
export const cancelReservation = async (reservationId: string): Promise<void> => {
  const res = await fetch(`${env.apiUrl}/reservations/${reservationId}`, {
    method: 'DELETE', // أو حسب endpoint الباك
  });

  if (!res.ok) throw new Error('Failed to cancel reservation');
};