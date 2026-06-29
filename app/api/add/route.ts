import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    //console.log(formData.get('title'));

    return new NextResponse(
      JSON.stringify({
        message: 'Success',
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 },
    );
  }
}
