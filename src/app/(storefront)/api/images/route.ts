import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEDIA_DIRS = [
  path.join(process.cwd(), 'public/img/products'),
  path.join(process.cwd(), 'public/media'),
  path.join(process.cwd(), 'public/uploads'),
  path.join(process.cwd(), 'public/img'),
];

function safeFileName(file: string): string | null {
  if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
    return null;
  }
  return file;
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/png';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = safeFileName(searchParams.get('file') || '');

  if (!file) {
    return new NextResponse('File missing', { status: 400 });
  }

  const candidates = [file];
  const ext = path.extname(file);
  if (ext === '.png') candidates.push(file.replace(/\.png$/i, '.jpg'));
  if (ext === '.jpg' || ext === '.jpeg') candidates.push(file.replace(/\.(jpg|jpeg)$/i, '.png'));

  for (const dir of MEDIA_DIRS) {
    for (const candidate of candidates) {
      const filePath = path.join(dir, candidate);
      if (!filePath.startsWith(dir)) continue;
      if (!fs.existsSync(filePath)) continue;

      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentTypeFor(filePath),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return new NextResponse('File not found', { status: 404 });
}
