import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .range(offset, offset + limit - 1);

    if (categoryError) throw categoryError;

    const { count: totalCount, error: countError } = await supabase
      .from('categories')
      .select('*', { count: 'exact' });

    if (countError) throw countError;

    return NextResponse.json({
      categories,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 