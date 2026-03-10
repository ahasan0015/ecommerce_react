// ১. মেইন প্রোডাক্ট ইন্টারফেস
export interface Product {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  category_id: number;
  status_id: number;
  base_price: number | string;
  description: string | null;
  image: string | null;
  category?: { name: string };
  brand?: { name: string };
  status?: { name: string };
}

// ২. ড্রপডাউন ডাটার জন্য (Category, Brand, Status)
export interface DropdownItem {
  id: number;
  name: string;
}

// ৩. ভ্যালিডেশন এররের জন্য (সব ফিল্ড কভার করবে)
export interface ProductErrors {
  name?: string[];
  category_id?: string[];
  brand_id?: string[];
  status_id?: string[];
  base_price?: string[];
  image?: string[];
  description?: string[];
  [key: string]: string[] | undefined; // ডাইনামিক ফিল্ডের জন্য
}