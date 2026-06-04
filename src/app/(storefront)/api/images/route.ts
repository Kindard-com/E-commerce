import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');
  
  if (!file) {
    return new NextResponse('File missing', { status: 400 });
  }

  const artifactsDir = '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c';
  const filePath = path.join(artifactsDir, file);

  try {
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    return new NextResponse('File not found', { status: 404 });
  }
}
