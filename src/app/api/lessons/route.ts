import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/models/Lesson';

export async function GET() {
  try {
    await dbConnect();
    const lessons = await Lesson.find({}).sort({ createdAt: -1 });
    return NextResponse.json(lessons, { status: 200 });
  } catch (error: any) {
    console.error('Fetch lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const lesson = await Lesson.create(body);
    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
