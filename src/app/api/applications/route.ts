import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    await dbConnect();
    const query = userId ? { userId } : email ? { email } : {};
    const applications = await Application.find(query, '-nationalIdImage -academicResultsImage').sort({ createdAt: -1 });
    return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const application = await Application.create(body);
    return NextResponse.json({ message: 'Application submitted successfully', id: application._id }, { status: 201 });
  } catch (error: any) {
    console.error('Application submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
