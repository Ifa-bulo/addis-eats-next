'use client';
import { useCart } from './cart-provider';
import Link from 'next/link';
export default function DishDetailActions({ dish }) { const { addItem } = useCart(); return <div className="detail-actions">{dish.isAvailable ? <button type="button" className="button button-primary" onClick={() => addItem(dish)}>Add to cart <span aria-hidden="true">+</span></button> : <p className="dish-unavailable-message" role="status">This dish is temporarily unavailable. Please choose another dish.</p>}<Link className="button button-dark" href={dish.isAvailable ? '/checkout' : '/menu'}>{dish.isAvailable ? 'Go to checkout →' : 'Browse available dishes →'}</Link></div>; }
