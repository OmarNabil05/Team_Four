export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type ReservationInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
  // New fields based on user request
  endTime?: string; // For time range
  tableClass?: 'A' | 'B' | 'C' | 'D'; // For table type/class
};

export type Reservation = {
  id: string;
  userId: string;
  tableId: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
} & ReservationInput;

export type TableClass = 'A' | 'B' | 'C' | 'D';

export type Table = {
  id: string;
  name: string;
  capacity: number;
  class: TableClass;
  isAvailable: boolean;
};

export type AvailableTableSearch = {
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  tableClass?: TableClass;
};