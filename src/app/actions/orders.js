'use server';

import { revalidatePath } from 'next/cache';
import { createOrder, getDish, getOrderForUser, getAllOrders, updateOrderStatus as updateStoreStatus } from '@/lib/data';
import { requireStaff, requireUser } from '@/lib/session';

function cleanItems(rawItems) {
  let items;
  try { items = JSON.parse(rawItems); } catch { return []; }
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const dish = typeof item?.id === 'string' ? getDish(item.id) : null;
      const quantity = Number(item?.quantity);
      if (!dish || !Number.isFinite(quantity) || quantity <= 0) return null;
      return { dishId: dish.id, name: dish.name, price: dish.price, quantity: Math.min(20, Math.floor(quantity)) };
    })
    .filter(Boolean)
    .slice(0, 30);
}

export async function placeOrder(_prevState, formData) {
  const session = await requireUser();
  const customerName = String(formData.get('customerName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const area = String(formData.get('area') || '').trim();
  const items = cleanItems(String(formData.get('items') || ''));
  const fieldErrors = {};

  if (customerName.length < 2) fieldErrors.customerName = 'Please enter your name.';
  if (!/^09\d{8}$/.test(phone)) fieldErrors.phone = 'Use a valid Ethiopian mobile number, e.g. 0912345678.';
  if (area.length < 2) fieldErrors.area = 'Please enter a delivery area.';
  if (!items.length) return { error: 'Your cart is empty.', fieldErrors };
  if (Object.keys(fieldErrors).length) return { error: '', fieldErrors };

  const order = createOrder({ userId: session.id, customerName, phone, area, items });
  revalidatePath('/orders');
  revalidatePath('/kitchen');
  return { success: true, orderId: order.id };
}

export async function cancelOrder(formData) {
  const session = await requireUser();
  const orderId = String(formData.get('orderId') || '');
  const order = getOrderForUser(orderId, session.id);
  if (!order) throw new Error('FORBIDDEN');
  if (order.status === 'delivered') throw new Error('Order cannot be cancelled after delivery.');
  updateStoreStatus(order.id, 'cancelled');
  revalidatePath('/orders');
  revalidatePath(`/orders/${order.id}`);
}

export async function setOrderStatus(_prevState, formData) {
  await requireStaff();
  const orderId = String(formData.get('orderId') || '');
  const status = String(formData.get('status') || '');
  const allowed = ['received','preparing','out-for-delivery','delivered'];
  if (!allowed.includes(status)) return { error: 'Invalid status.' };
  const order = getAllOrders().find((entry) => entry.id === orderId);
  if (!order) return { error: 'Order not found.' };
  if (order.status === 'cancelled') return { error: 'Cancelled orders cannot be updated.' };
  updateStoreStatus(orderId, status);
  revalidatePath('/kitchen');
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}
