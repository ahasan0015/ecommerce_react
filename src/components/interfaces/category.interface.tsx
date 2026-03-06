export interface Category {
  id?: number;          // এডিট করার সময় আইডি প্রয়োজন হয়
  name: string;         // ক্যাটাগরির নাম
  brand_id: number;     // কোন ব্র্যান্ডের অধীনে
  brand_name?: string;  // API থেকে আসা ব্র্যান্ড নাম
  status_id: number;    // Active / Inactive
  status_name?: string; // API থেকে আসা স্ট্যাটাস নাম
  slug: string;         // URL slug
  created_at?: string;
  updated_at?: string;
}
export const defaultCategory: Category = {
  name: "",
  brand_id: 0,
  status_id: 1, // default Active
  slug: "",
};