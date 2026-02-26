
import { Link} from "react-router-dom";

function Register() {
  



  return (
    <div className="container-fluid py-4 d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold mb-3 text-center text-success">Register</h4>

            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create password"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button className="btn btn-success btn-lg">Register</button>
              </div>

              <p className="text-center mb-0">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
