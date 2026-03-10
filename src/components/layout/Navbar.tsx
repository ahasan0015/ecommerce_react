import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('bearer_token');
    // localStorage.removeItem('user_name');
    navigate('/login');
    // window.location.href = '/login'
  };
  return (
    <nav className="navbar navbar-expand-lg shadow-sm navbar-gradient">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold text-white" to="/admin/dashboard">
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
              >
                👤 Admin
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/admin/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item-logout text-danger" onClick={handleLogout}>
                    Logout
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
