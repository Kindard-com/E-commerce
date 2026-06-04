import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicImg = path.join(process.cwd(), 'public', 'img');
    const productsDir = path.join(publicImg, 'products');

    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }

    const files = [
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/hero_kids_streetwear_1779803641942.png',
        dest: path.join(publicImg, 'hero.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_tee_blue_1779803656124.png',
        dest: path.join(productsDir, 'tee_blue.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_hoodie_cream_1779803671261.png',
        dest: path.join(productsDir, 'hoodie_cream.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_shorts_navy_1779803696624.png',
        dest: path.join(productsDir, 'shorts_navy.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_knit_sweater_1779803717074.png',
        dest: path.join(productsDir, 'knit_sweater.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_beanie_orange_1779803732374.png',
        dest: path.join(productsDir, 'beanie_orange.png')
      },
      {
        src: '/Users/marktplaats/.gemini/antigravity-ide/brain/406c18f3-c483-43bb-827b-393430973b5c/product_kid_jacket_denim_1779803748559.png',
        dest: path.join(productsDir, 'jacket_denim.png')
      }
    ];

    for (const file of files) {
      if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, file.dest);
      } else {
        console.error('Source not found:', file.src);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
