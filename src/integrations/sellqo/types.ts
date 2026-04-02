export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  collection?: string;
  collections?: string[];
  category?: Category;
  categories?: Category[];
  tags?: string[];
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stock_quantity?: number;
  sku?: string;
  in_stock: boolean;
  has_variants: boolean;
  related_products?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stock_quantity?: number;
  options: Record<string, string>;
  image?: ProductImage;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  product_count?: number;
  parent_id?: string;
  position: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  product_count?: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  variant_title: string;
  price: number;
  quantity: number;
  image?: string;
  max_quantity?: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  discount_code?: string;
}

export interface CheckoutSession {
  id: string;
  checkout_url: string;
  cart_id: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ProductsParams {
  collection?: string;
  category?: string;
  category_slug?: string;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'title_asc' | 'bestselling';
  page?: number;
  per_page?: number;
  in_stock?: boolean;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
