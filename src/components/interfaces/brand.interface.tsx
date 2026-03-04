export interface Brand {
  id?: number;          // এডিট করার সময় আইডি প্রয়োজন হয়
  name: string;        // ব্র্যান্ডের নাম
  status_id: number;   // স্ট্যাটাস আইডি (Active/Inactive)
  logo?: string;       // ডাটাবেস থেকে আসা ইমেজের ফাইল পাথ (String)
  created_at?: string; 
  updated_at?: string;
}

// নতুন ব্র্যান্ড তৈরি করার সময় ডিফল্ট ভ্যালু
export const defaultBrand: Brand = {
  name: "",
  status_id: 1, // ডিফল্টভাবে Active (ধরে নিলাম ১ মানে Active)
};