import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
// import "./App.css";

export default function App() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="main-content d-flex flex-column min-vh-100">
        {/* Navbar */}
        <Navbar />

        {/* Outlet / Page Content */}
        <main className="flex-fill p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
