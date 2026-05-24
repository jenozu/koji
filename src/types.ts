export interface Product {
  id: string;
  title: string;
  character: string;
  franchise: string;
  price: number;
  description: string;
  imageUrl: string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  category: 'prints' | 'apparel' | 'accessories' | 'cozy' | 'stationery' | 'plush';
  vibe: 'dreamy' | 'fierce' | 'nostalgia' | 'cozy';
  colors: string[];
  features: string[];
  backstory?: string;
}

export type PrintSize = 'A5_MINI' | 'A4_MEDIUM' | 'A3_LARGE' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeOption {
  value: PrintSize;
  label: string;
  dimensions: string;
  priceModifier: number;
}

export type FrameColor = 'NONE' | 'MUTED_MINT' | 'STRAWBERRY_PINK' | 'CREAM_WOOD';

export interface FrameOption {
  value: FrameColor;
  label: string;
  priceModifier: number;
  hex: string;
}

export interface CartItem {
  cartId: string; // unique cart entry id, combines id + size + frame + color
  product: Product;
  size: PrintSize;
  frame: FrameColor;
  color?: string;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  emoji: 'happy' | 'excited' | 'star-eyed' | 'shy';
  printId?: string; // Optional reference to print
}
