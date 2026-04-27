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
  user?: User;
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// dynamic status color and icon mapper
const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "Pending":
      return { class: "border-warning text-warning", icon: "⏳" };
    case "Processing":
      return { class: "border-info text-info", icon: "⚙️" };
    case "Completed":
      return { class: "border-success text-success", icon: "✅" };
    case "Cancelled":
      return { class: "border-danger text-danger", icon: "❌" };
    default:
      return { class: "border-primary text-primary", icon: "📄" };
  }
};

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleStatusChange = async (orderId: number, newStatusId: string) => {
    // এখানে আপনার ডাটাবেস আইডি অনুযায়ী কন্ডিশন চেক করুন (যদি ৪ বাতিল হয়)
    if (newStatusId === "4") {
      const result = await Swal.fire({
        title: "Are You Sure?",
        text: "Are you sure you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Cancel it!",
      });

      if (!result.isConfirmed) {
        window.location.reload();
        return;
      }
    }

    try {
      const response = await api.put(`admin/orders/${orderId}/status`, {
        order_status_id: newStatusId,
      });

      if (response.data.status === "success") {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, order_status_id: parseInt(newStatusId) }
              : order,
          ),
        );

        Toast.fire({
          icon: "success",
          title: response.data.message || "Status Updated Successfully",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error updating status:", axiosError);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: axiosError.response?.data?.message || "Something went wrong.",
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("admin/orders"), api.get("admin/order-statuses")])
      .then(([ordersRes, statusRes]) => {
        setOrders(ordersRes.data);
        setStatuses(statusRes.data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        Toast.fire({ icon: "error", title: "Failed to load data!" });
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
                  orders.map((order) => {
                   
                    const currentStatus = statuses.find(
                      (s) => s.id === order.order_status_id,
                    );
                    const currentStyle = getStatusStyle(
                      currentStatus?.name || "",
                    );

                    return (
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
                            className={`form-select form-select-sm fw-bold ${currentStyle.class}`}
                            style={{ width: "160px", cursor: "pointer" }}
                            value={order.order_status_id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            {statuses.map((status) => (
                              <option
                                key={status.id}
                                value={status.id}
                                className="text-dark"
                              >
                                {getStatusStyle(status.name).icon} {status.name}
                              </option>
                            ))}
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
                    );
                  })
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
