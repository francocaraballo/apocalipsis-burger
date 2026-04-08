export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'clasicas' | 'premium' | 'veggie' | 'extras';
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProductCategory = Product['category'];
