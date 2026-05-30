import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await dbConnect();
    const { status } = await req.json();
    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(application, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await dbConnect();
    const application = await Application.findById(id);
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(application, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
