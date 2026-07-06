import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../../src/components/contex/AtuhContex"; 
import Swal from "sweetalert2";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
        navigate('/login');
        Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm navbar-gradient">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-white" to="/dashboard">
          NEXT Admin
        </NavLink>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle text-white fw-semibold"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {user?.role === 'admin' ? 'Admin' : 'Manager'}
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-lg-end shadow border-0 mt-2">
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