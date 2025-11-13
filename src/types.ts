export type MenuCategory = 'Appetizers' | 'Main Courses' | 'Desserts' | 'Drinks';

export type MenuItem = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItemInput = Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>;

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export type Reservation = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ReservationInput = Omit<Reservation, '_id' | 'status' | 'createdAt' | 'updatedAt'>;
