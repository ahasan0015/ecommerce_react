export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;   // or Date if you convert it
  phone?: string;
  status?: "active" | "inactive" | string;  // optional enum
  role_name?: string;
  password?:string;
}
export const defaultUser: User = {
  id: 0,
  name: "",
  email: "",
  created_at: "",
  password: "",
  
};