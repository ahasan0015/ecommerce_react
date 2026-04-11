/**
 * Variant Interface
 * 
 */
export interface Variant {
  variant_id?: number; // 
  sku: string;
  sale_price: string | number;
  stock: number;
  color_id: string | number;
  size_id: string | number;
  image?: File | string | null; // for image upload
}

/**
 * Product Interface
 * 
 */
export interface Product {
  product_id?: number;
  product_name: string;
  category_id: string | number;
  brand_id: string | number;
  status_id: string | number;
  description: string;
  base_price?: string | number; // optional, if main price given
  variants: Variant[]; // Variant Array
}

export const defaultProduct: Product = {
  product_name: "",
  category_id: "",
  brand_id: "",
  status_id: 1, // ডিফল্ট 'Active' আইডি হিসেবে ১ ধরা হয়েছে
  description: "",
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