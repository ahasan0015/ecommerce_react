import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../public/images/banner.jpg"; // Your background image
import { defaultUser, type User } from "./interfaces/User.interfaces";
import api from "../config";


 function Login() {
  const navigate = useNavigate();
    const [user, setUser]=useState<User>(defaultUser);

    useEffect(() =>{
      document.title= "Login";
    },[]);

    const handelLogin =(e:React.FormEvent)=>{
      e.preventDefault();
      
      api.post("login", user)
      .then((res) => {
        console.log("login Response:", res.data);
        
        // টোকেন সেভ করা
        if (res.data.token) {
           localStorage.setItem('token', res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
        }

        if (res.data.success) {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
 

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="col-md-5">
        <div className="card shadow-lg" style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
          <div className="card-body p-4">

            {/* Header */}
            <h4 className="fw-bold mb-3 text-center text-primary">Login</h4>
            <p className="text-center text-muted mb-4">
              Welcome back! Please login to your account.
            </p>

            {/* Form */}
            <form onSubmit={handelLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  name="email"
                  value={user.email ?? ""}
                  onChange={(e) =>setUser({...user, email: e.target.value})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  name="password"
                  value={user.password ?? ""}
                  onChange={(e) =>setUser({...user, password: e.target.value})}
                />
              </div>

              <div className="d-grid mb-3">
                <button className="btn btn-primary btn-lg">Login</button>
              </div>

              <p className="text-center mb-0">
                Don’t have an account? <Link to="/register">Register</Link>
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;