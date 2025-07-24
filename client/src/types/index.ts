export interface ProductImage {
  id: string;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_category: number | null;
  subcategories: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category: Category;
  subcategory: Category | null;
  materials: string;
  colors: string;
  dimensions_length: number | null;
  dimensions_width: number | null;
  dimensions_height: number | null;
  dimensions_display: string;
  weight: number | null;
  stock_quantity: number;
  featured: boolean;
  is_in_stock: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  primary_image: ProductImage | null;
  category_name: string;
  colors: string;
  materials: string;
  featured: boolean;
  is_in_stock: boolean;
  created_at: string;
}

export interface HomeSlider {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link_url: string;
  link_text: string;
  order: number;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
