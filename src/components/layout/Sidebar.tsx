import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* Logo */}
      <div className="sidebar-header text-center py-3 fw-bold">
        NEXT Admin
      </div>

      {/* Toggle */}
      <div className="text-center mb-3">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "« Collapse" : "» Expand"}
        </button>
      </div>

      {/* Menu */}
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link sidebar-link">
            📊 Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/users" className="nav-link sidebar-link">
            👥 Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/roles" className="nav-link sidebar-link">
            🛡️ Roles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/brands" className="nav-link sidebar-link">
            📂 Brands
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/categories" className="nav-link sidebar-link">
            📂 Categories
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/products" className="nav-link sidebar-link">
            🛍️ Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/orders" className="nav-link sidebar-link">
            📦 Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/coupons" className="nav-link sidebar-link">
            🎁 Coupons
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/reports" className="nav-link sidebar-link">
            📈 Reports
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className="nav-link sidebar-link">
            ⚙️ Settings
          </NavLink>
        </li>
        <hr className="sidebar-divider" />
        <li className="nav-item">
          <NavLink
            to="/admin/logout"
            className="nav-link sidebar-link text-danger"
          >
            🚪 Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
