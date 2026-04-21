import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config";

// টাইপ সেফটির জন্য ইন্টারফেস
interface User {
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: number;
  order_number: string;
  subtotal: string;
  discount: string;
  total: string;
  payment_method: string;
  created_at: string;
  order_status_id: number;
  user: User;
}

const DetailsOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .get(`admin/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-5 text-center">Loading Details...</div>;
  if (!order)
    return <div className="p-5 text-center text-danger">Order not found!</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Order Details: #{order.order_number}</h4>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary rounded-pill"
        >
          Go Back
        </button>
      </div>

      <div className="row">
        {/* বাম পাশ: কাস্টমার এবং পেমেন্ট ইনফো */}
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Customer Information</h6>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted w-25">Customer Name:</td>
                    <td className="fw-bold">{order.user.name}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Email:</td>
                    <td>{order.user.email}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Phone:</td>
                    <td>{order.user.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Payment Details</h6>
            </div>
            <div className="card-body">
              <p>
                <strong>Method:</strong> {order.payment_method}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString("bn-BD")}
              </p>
            </div>
          </div>
        </div>

        {/* ডান পাশ: সামারি */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white mb-4">
            <div className="card-body p-4 text-center">
              <p className="mb-1">Total Order Amount</p>
              <h2 className="fw-bold">
                ৳{parseFloat(order.total).toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Order Summary</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Discount:</span>
                <span className="text-danger">- ৳{order.discount}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span className="text-primary">৳{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOrder;
