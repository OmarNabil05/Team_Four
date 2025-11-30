export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type ReservationInput = {
  customerName: string;      // الاسم
  email: string;             // الايميل
  phone: string;             // رقم الهاتف
  tableId: string;           // Id الطاولة
  timeStart: string;         // وقت البداية بصيغة ISO
  peopleCount: number;       // عدد الأفراد
  message?: string;          // ملاحظات اختيارية
  status: ReservationStatus;         // الحالة ثابتة على "pending"
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