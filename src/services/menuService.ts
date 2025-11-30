import env from '../config/env';
import type { MenuItem } from '../types';

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const res = await fetch(`${env.apiUrl}/menu`);

  if (!res.ok) {
    throw new Error('Failed to fetch menu');
  }

  const data = await res.json();

return data.map((item: any) => ({
  _id: item._id,
  title: item.name,
  description: item.description,
  price: item.price,
  imageUrl: item.photoUrl,
  category:
    item.category === "Dessert" ? "Desserts" :
    item.category === "Beverage" ? "Drinks" :
    item.category.toLowerCase() === "drinks" ? "Drinks" :
    item.category,  // أي حاجة تانية
  isAvailable: true,
}));

};
