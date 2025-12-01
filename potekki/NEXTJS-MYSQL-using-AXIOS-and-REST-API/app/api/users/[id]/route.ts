import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params; // Await params first!
    const id = parseInt(idString, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    console.log('Executing PUT query:', sql, 'with params:', [name, email, id]);
    const result: any = await query(sql, [name, email, id]);
    console.log('PUT query result:', result);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: `Failed to update user: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params; // Await params first!
    const id = parseInt(idString, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const sql = 'DELETE FROM users WHERE id = ?';
    console.log('Executing DELETE query:', sql, 'with params:', [id]);
    const result: any = await query(sql, [id]);
    console.log('DELETE query result:', result);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: `Failed to delete user: ${error}` }, { status: 500 });
  }
}