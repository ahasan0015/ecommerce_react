/**
 * ১. রিলেশনাল টেবিলগুলোর জন্য কমন ইন্টারফেস
 * (Category, Brand, Status সবারই id এবং name আছে)
 */
interface RelatedData {
    id: number;
    name: string;
    slug?: string; // ঐচ্ছিক
}

/**
 * ২. মূল প্রোডাক্ট টেবিলের ইন্টারফেস
 */
export interface Product {
    id: number;
    category_id: number;
    brand_id: number;
    status_id: number;
    name: string;
    slug: string;
    description: string | null; // ডাটাবেজে nullable থাকলে
    base_price: number | string; // লারাভেল থেকে decimal অনেক সময় string হিসেবে আসে
    image: string | null; // ইমেজের পাথ
    created_at: string;
    updated_at: string;

    // লারাভেল রিলেশনশিপ (Eager Loading করলে এই ডাটাগুলো পাওয়া যাবে)
    category?: RelatedData;
    brand?: RelatedData;
    status?: RelatedData;
}

/**
 * ৩. প্রোডাক্ট ক্রিয়েট বা ফর্ম সাবমিশনের জন্য ইন্টারফেস (ঐচ্ছিক কিন্তু দরকারী)
 */
export interface ProductFormData {
    name: string;
    category_id: string | number;
    brand_id: string | number;
    status_id: string | number;
    base_price: string | number;
    description: string;
    image?: File | null; // ফর্মের ক্ষেত্রে এটি ফাইল অবজেক্ট হবে
}