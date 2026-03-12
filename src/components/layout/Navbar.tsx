import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../../src/components/contex/AtuhContex"; // আপনার AuthContext এর পাথ অনুযায়ী দিন

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Context থেকে user এবং logout নিয়ে আসা

  const handleLogout = () => {
    // ১. Context এর logout ফাংশন কল করা (এটি localStorage থেকে token এবং role মুছে দেবে)
    logout(); 
    
    // ২. লগইন পেজে পাঠিয়ে দেওয়া
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm navbar-gradient">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold text-white" to="/dashboard">
          NEXT Admin
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Right Side */}
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle text-white fw-semibold"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* ইউজারের নাম ডাইনামিক করা */}
                👤 {user?.role === 'admin' ? 'Admin' : 'Manager'}
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <NavLink className="dropdown-item py-2" to="/profile">
                    <i className="bi bi-person me-2"></i> Profile
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger py-2 fw-bold" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}