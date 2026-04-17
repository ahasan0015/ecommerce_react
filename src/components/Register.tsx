import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// ১. ডাটা এবং এরর-এর জন্য টাইপ ডিক্লেয়ারেশন
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface ValidationErrors {
  name?: string[];
  email?: string[];
  phone?: string[];
  password?: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const Register: React.FC = () => {
  // ২. স্টেট ম্যানেজমেন্ট উইথ টাইপ
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // ৩. ইনপুট হ্যান্ডলার
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ইউজার টাইপ করা শুরু করলে ওই ফিল্ডের এরর স্টেট ক্লিয়ার করা
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ৪. সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // এপিআই কল (নিশ্চিত করুন আপনার লারাভেল এপিআই এই ইউআরএল-এ আছে)
      const response = await axios.post<ApiResponse>(
        "http://localhost:8000/api/register", 
        formData
      );

      if (response.data.success) {
        alert(response.data.message || "Registration Successful!");
        navigate("/login");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ errors: ValidationErrors }>;
      
      if (axiosError.response && axiosError.response.status === 422) {
        // লারাভেল ভ্যালিডেশন এরর রিসিভ করা
        setErrors(axiosError.response.data.errors);
      } else {
        alert("Server error! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-success py-4 text-center text-white">
              <h3 className="fw-bold mb-0">NextFashion</h3>
              <p className="small mb-0 opacity-75">Create your account to start shopping</p>
            </div>
            
            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter your name"
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="example@mail.com"
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="017XXXXXXXX"
                    required
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Repeat password"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid mt-2">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg fw-bold" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    {loading ? "Registering..." : "Join Now"}
                  </button>
                </div>

                <div className="text-center mt-4 text-muted small">
                  Already have an account?{" "}
                  <Link to="/login" className="text-success fw-bold text-decoration-none">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;