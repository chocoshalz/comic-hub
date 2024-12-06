import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || "";

  if (filename && request.body) {
    const blob = await put(filename, request.body, {
      access: 'public',
      token: process.env.bonkcomichub_READ_WRITE_TOKEN, 
    });

    return NextResponse.json(blob);
  } else {
    return NextResponse.json({ message: "No filename detected" });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ message: "Filename is required for deletion" }, { status: 400 });
  }

  try {
    await del(filename, { token: process.env.bonkcomichub_READ_WRITE_TOKEN });
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error:any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: "Failed to delete file", error: error.message }, { status: 500 });
  }
}
