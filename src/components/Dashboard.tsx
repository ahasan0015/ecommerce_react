import React from "react";
import "../assets/css/Dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="container-fluid mt-4">

      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <span>Welcome, Admin</span>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 h-100">
            <h6>Total Orders</h6>
            <h3 className="fw-bold text-primary">1,245</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 h-100">
            <h6>Total Products</h6>
            <h3 className="fw-bold text-success">398</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 h-100">
            <h6>Total Customers</h6>
            <h3 className="fw-bold text-warning">1,024</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 h-100">
            <h6>Revenue</h6>
            <h3 className="fw-bold text-danger">৳ 1,25,000</h3>
          </div>
        </div>
      </div>

      {/* Charts / Analytics Placeholder */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="fw-bold mb-3">Sales Overview</h5>
            <div className="chart-placeholder text-center">
              {/* You can integrate Chart.js or Recharts here */}
              <p className="text-muted">[Chart goes here]</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="fw-bold mb-3">Top Products</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Men's T-Shirt
                <span className="badge bg-primary rounded-pill">120</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Men's Jeans
                <span className="badge bg-success rounded-pill">95</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Backpack
                <span className="badge bg-warning rounded-pill">80</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Watch
                <span className="badge bg-danger rounded-pill">45</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card shadow-sm p-3">
        <h5 className="fw-bold mb-3">Recent Orders</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1024</td>
                <td>John Doe</td>
                <td>2026-02-03</td>
                <td><span className="badge bg-success">Completed</span></td>
                <td>৳ 4,500</td>
              </tr>
              <tr>
                <td>#1025</td>
                <td>Jane Smith</td>
                <td>2026-02-03</td>
                <td><span className="badge bg-warning">Pending</span></td>
                <td>৳ 2,300</td>
              </tr>
              <tr>
                <td>#1026</td>
                <td>Ali Khan</td>
                <td>2026-02-02</td>
                <td><span className="badge bg-danger">Cancelled</span></td>
                <td>৳ 1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
