export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;   // or Date if you convert it
  phone?: string;
  status?: "active" | "inactive" | string;  // optional enum
  role_name?: string;
  role_id:number;
  password?:string;
}
export const defaultUser: User = {
  id: 0,
  name: "Roxy",
  email: "ahasanstu@gmail.com",
  phone:"",
  role_id:0,
  created_at: "",
  password: "",
  
};