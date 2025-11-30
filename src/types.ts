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
  tableClass?: 'a' | 'b' | 'c' | 'd'; // For table type/class
};

export type Reservation = {
  id: string;
  userId: string;
  tableId: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
} & ReservationInput;

export type TableClass = 'a' | 'b' | 'c' | 'd';

export type TableItem = {
  _id: string;
  name: string;
  category: string;
  maxSeats: number;
  reserved: boolean;
  isAvailable?: boolean; 
};

export type AvailableTableSearch = {
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  tableClass?: TableClass;
};
export type MenuCategory = "Appetizers" | "Main Courses" | "Desserts" | "Drinks";

export interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  isAvailable: boolean;
}