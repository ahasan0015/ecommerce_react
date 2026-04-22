/**
 * Common Dropdown Interface
 */
export interface DropdownOption {
  id: number | string;
  name: string;
}

/**
 * Variant Interface
 */
export interface Variant {
  variant_id?: number; 
  sku: string;
  sale_price: string | number;
  stock: number;
  color_id: string | number;
  size_id: string | number;
  image?: File | string | null;
}

/**
 * Main Product Interface
 */
export interface Product {
  product_id?: number;
  product_name: string;
  category_id: string | number;
  brand_id: string | number;
  status_id: string | number;
  description: string;
  base_price?: string | number; 
  main_image?: File | null;      
  gallery_images?: File[];       
  variants: Variant[];           
}

/**
 * Default Initial State
 */
export const defaultProduct: Product = {
  product_name: "",
  category_id: "",
  brand_id: "",
  status_id: 1, 
  description: "",
  base_price: "",
  variants: [
    {
      sku: "",
      sale_price: "",
      stock: 0,
      color_id: "",
      size_id: "",
      image: null,
    },
  ],
};