import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await dbConnect();
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Notice deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete notice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
