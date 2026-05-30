import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET() {
  try {
    await dbConnect();
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notices, { status: 200 });
  } catch (error: any) {
    console.error('Fetch notices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const notice = await Notice.create(body);
    return NextResponse.json(notice, { status: 201 });
  } catch (error: any) {
    console.error('Create notice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
