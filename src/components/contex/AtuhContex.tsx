import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// ১. ইউজারের ডাটা টাইপ (Interface)
// আমরা 'admin' বা 'manager' স্ট্রিং ব্যবহার করব কোডিং সহজ করার জন্য
interface User {
  token: string;
  role: "admin" | "manager";
}

// ২. কনটেক্সট এর জন্য টাইপ ডিফাইন করা
interface AuthContextType {
  user: User | null;
  login: (userData: { token: string; role: any }) => void;
  logout: () => void;
  loading: boolean;
}

// ৩. কনটেক্সট তৈরি
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ৪. কাস্টম হুক (useAuth) - এটি সব কম্পোনেন্টে ব্যবহার করবেন
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ৫. প্রোভাইডার কম্পোনেন্ট
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // পেজ রিফ্রেশ করলে LocalStorage থেকে ডাটা রিকভার করা
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"];

    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // লগইন ফাংশন: এটি লারাভেলের role_id কে admin/manager এ কনভার্ট করবে
  const login = (userData: { token: string; role: any }) => {
    let formattedRole: "admin" | "manager" = "manager";

    // লারাভেলের role_id: 1 হলে admin, অন্যথায় manager
    if (userData.role === 1 || userData.role === "1" || userData.role === "admin") {
      formattedRole = "admin";
    }

    const cleanData: User = {
      token: userData.token,
      role: formattedRole,
    };

    localStorage.setItem("token", cleanData.token);
    localStorage.setItem("role", cleanData.role);
    setUser(cleanData);
  };

  // লগআউট ফাংশন: সব ডাটা ক্লিয়ার করবে
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};