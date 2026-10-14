'use server';

import { revalidatePath } from 'next/cache';
import { requireStaff } from '@/lib/session';
import { setDishAvailability as setStoredDishAvailability } from '@/lib/data';

export async function setDishAvailability(formData) {
  await requireStaff();
  const dishId = String(formData.get('dishId') || '').trim();
  const rawAvailability = String(formData.get('isAvailable') || '');
  if (!dishId || !['true', 'false'].includes(rawAvailability)) {
    throw new Error('Invalid menu availability request.');
  }

  const updated = setStoredDishAvailability(dishId, rawAvailability === 'true');
  if (!updated) throw new Error('Dish not found.');

  revalidatePath('/admin/menu');
  revalidatePath('/dashboard');
  revalidatePath('/menu');
  revalidatePath('/');
  revalidatePath('/api/dishes');
  revalidatePath(`/menu/${dishId}`);
}
