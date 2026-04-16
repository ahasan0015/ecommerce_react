import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  // ১. স্টেট ম্যানেজমেন্ট
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "", // লারাভেলের 'confirmed' রুলের জন্য এটি জরুরি
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ২. ইনপুট হ্যান্ডলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // টাইপ করার সময় এরর মেসেজ মুছে ফেলা
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // ৩. সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // আপনার লারাভেল এপিআই ইউআরএল নিশ্চিত করুন
      const response = await axios.post("http://localhost:8000/api/register", formData);

      if (response.data.success) {
        alert("Registration Successful!");
        navigate("/login"); // সফল হলে লগইন পেজে নিয়ে যাবে
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // লারাভেল থেকে আসা ভ্যালিডেশন এররগুলো সেট করা
        setErrors(err.response.data.errors);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center fw-bold text-success mb-4">Create Account</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="example@mail.com"
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="017XXXXXXXX"
                  onChange={handleChange}
                  required
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="min 6 characters"
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  placeholder="Re-type password"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                  {loading ? "Registering..." : "Register Now"}
                </button>
              </div>

              <div className="text-center mt-3">
                <span>Already have an account? </span>
                <Link to="/login" className="text-success text-decoration-none fw-bold">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;