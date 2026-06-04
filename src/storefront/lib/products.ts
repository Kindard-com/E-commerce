export type Product = {
  id: string | number;
  medusa_id?: string;
  variants?: any[];
  brand: string;
  name: string;
  price: number;
  orig: number | null;
  discount: number | null;
  emoji?: string;
  image?: string;
  dark?: boolean;
  colors: string[];
  sizes: string[];
  avail: string[];
  rating: number;
  isNew: boolean;
  category: string;
  sold?: boolean;
};

export const fallbackProducts: Product[] = [
  {
    id: 1,
    brand: 'KINDARD KIDS',
    name: 'Classic Logo Tee',
    price: 35,
    orig: null,
    discount: null,
    image: '/api/images?file=product_kid_tee_blue_1779803656124.png',
    dark: false,
    colors: ['#7A92A3', '#F5F5F0', '#EAB871'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: ['1-2Y', '2-3Y', '4-5Y', '5-6Y'],
    rating: 4.9,
    isNew: true,
    category: 'tees',
  },
  {
    id: 2,
    brand: 'KINDARD KIDS',
    name: 'Mini Explorer Hoodie',
    price: 65,
    orig: null,
    discount: null,
    image: '/api/images?file=product_kid_hoodie_cream_1779803671261.png',
    dark: false,
    colors: ['#F5F5F0', '#B0B0B0'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    rating: 4.8,
    isNew: true,
    category: 'hoodies',
  },
  {
    id: 3,
    brand: 'KINDARD KIDS',
    name: 'Playtime Sweat Shorts',
    price: 30,
    orig: 40,
    discount: 25,
    image: '/api/images?file=product_kid_shorts_navy_1779803696624.png',
    dark: true,
    colors: ['#1E2A40', '#0a0a0a'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: ['1-2Y', '2-3Y', '3-4Y'],
    rating: 4.6,
    isNew: false,
    category: 'shorts',
  },
  {
    id: 4,
    brand: 'KINDARD KIDS',
    name: 'Chunky Cable Knit',
    price: 85,
    orig: null,
    discount: null,
    image: '/api/images?file=product_kid_knit_sweater_1779803717074.png',
    dark: false,
    colors: ['#E6DACD', '#D4C4A0'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: ['1-2Y', '3-4Y', '5-6Y'],
    rating: 5.0,
    isNew: false,
    category: 'knits',
  },
  {
    id: 5,
    brand: 'KINDARD KIDS',
    name: 'Urban Ribbed Beanie',
    price: 24,
    orig: null,
    discount: null,
    image: '/api/images?file=product_kid_beanie_orange_1779803732374.png',
    dark: false,
    colors: ['#E86A2D', '#1E2A40', '#0a0a0a'],
    sizes: ['One Size'],
    avail: ['One Size'],
    rating: 4.7,
    isNew: true,
    category: 'accessories',
  },
  {
    id: 6,
    brand: 'KINDARD KIDS',
    name: 'Vintage Wash Denim Jacket',
    price: 95,
    orig: 120,
    discount: 20,
    image: '/api/images?file=product_kid_jacket_denim_1779803748559.png',
    dark: false,
    colors: ['#5C7B9E'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
    avail: ['3-4Y', '4-5Y', '5-6Y'],
    rating: 4.9,
    isNew: false,
    category: 'jackets',
  },
];
