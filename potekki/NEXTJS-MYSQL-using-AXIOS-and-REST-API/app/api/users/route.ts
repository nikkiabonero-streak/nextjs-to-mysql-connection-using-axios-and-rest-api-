import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sql = 'SELECT id, name, email FROM users ORDER BY id DESC';
    const users = await query(sql);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const result = await query(sql, [name, email]);

    return NextResponse.json({ message: 'User added successfully', result }, { status: 201 });
  } catch (error) {
 
    if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to add user' }, { status: 500 });
  }
}