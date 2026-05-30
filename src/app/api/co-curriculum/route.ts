import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CoCurriculum from '@/models/CoCurriculum';

export async function GET() {
  try {
    await dbConnect();
    const items = await CoCurriculum.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const item = await CoCurriculum.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
