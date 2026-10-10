import { NextResponse } from 'next/server';
import { searchDishes } from '@/lib/data';

export function GET(request) {
  const query = request.nextUrl.searchParams.get('query') || '';
  const popularOnly = request.nextUrl.searchParams.get('popular') === 'true';
  const results = searchDishes(query).filter((dish) => !popularOnly || dish.popular);
  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' }
  });
}
