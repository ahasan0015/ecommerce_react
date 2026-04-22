import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../config";
import Swal from "sweetalert2";
import type { AxiosError } from "axios";

// --- Interfaces ---
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Order {
  id: number;
  order_number: string;
  total: string;
  created_at: string;
  order_status_id: number;
  user?: User; // Optional user relationship
}

// SweetAlert Toast configuration for reusable notifications
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ১. status update
  const handleStatusChange = async (orderId: number, newStatusId: string) => {
    if (newStatusId === "4") {
      const result = await Swal.fire({
        title: "Are You Sure?",
        text: "Stock will decrease when the order is marked as Delivered",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes Delivered",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      const response = await api.put(`admin/orders/${orderId}/status`, {
        order_status_id: newStatusId,
      });

      if (response.data.status === "success") {
        // local state update
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, order_status_id: parseInt(newStatusId) }
              : order,
          ),
        );

        // SweetAlert Success Toast
        Toast.fire({
          icon: "success",
          title: response.data.message || "Status Updated Successfully",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error updating status:", axiosError);
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "ওহ না!",

        text:
          axiosError.response?.data?.message ||"There was a problem updating the status।",
      });
    }
  };

  useEffect(() => {
    api
      .get("admin/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => {
        console.error("Error fetching orders:", error);
        Toast.fire({
          icon: "error",
          title: "Failed to load data.!",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">Order Management</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary">
                <tr>
                  <th className="ps-4">Order #</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-medium text-primary">
                        #{order.order_number}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">
                          {order.user?.name || "Guest User"}
                        </div>
                        <small className="text-muted">
                          {order.user?.email}
                        </small>
                      </td>
                      <td className="fw-bold">
                        ৳{parseFloat(order.total).toLocaleString()}
                      </td>

                      <td>
                        <select
                          className={`form-select form-select-sm fw-bold ${
                            order.order_status_id === 4
                              ? "border-success text-success"
                              : order.order_status_id === 5
                                ? "border-danger text-danger"
                                : "border-primary text-primary"
                          }`}
                          style={{ width: "140px", cursor: "pointer" }}
                          value={order.order_status_id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="1">⏳ Pending</option>
                          <option value="2">⚙️ Processing</option>
                          <option value="3">🚚 Shipped</option>
                          <option value="4">✅ Delivered</option>
                          <option value="5">❌ Cancelled</option>
                        </select>
                      </td>

                      <td className="text-center">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No Order Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
