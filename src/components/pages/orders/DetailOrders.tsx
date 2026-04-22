import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FC } from "react";
import api from "../../../config";

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

/** * interfaces for Type Safety */
interface MasterData {
  id: number;
  name: string;
  hex_code?: string;
}

interface OrderItem {
  id: number;
  product: {
    name: string;
    id: number;
  };
  variant: {
    sku: string;
    size: MasterData;
    color: MasterData;
  };
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  subtotal: string;
  discount: string;
  total: string;
  payment_method: string;
  payment_status_id: number;
  payment_status?: { name: string };
  status?: { name: string };
  created_at: string;
  shipping_address?: ShippingAddress;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
}

const DetailsOrder: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .get(`/admin/orders/${id}`)
      .then((res) => {
        setOrder(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Order Load Error:", err.response?.data || err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="p-5 text-center">Loading Order Details...</div>;
  if (!order)
    return <div className="p-5 text-center text-danger">Order Not Found!</div>;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold py-3 mb-0">
          <span className="text-muted fw-light">Orders /</span> Details #
          {order.order_number}
        </h4>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Back to List
        </button>
      </div>

      <div className="row">
        {/* Left Column: Items and Customer */}
        <div className="col-12 col-lg-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Order Items</h5>
            </div>
            <div className="table-responsive">
              <table className="table border-top">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="fw-medium text-heading">
                          {item.product.name}
                        </span>
                        <div className="small text-muted">
                          Size: {item.variant.size.name} | Color:{" "}
                          {item.variant.color.name}
                        </div>
                      </td>
                      <td>{item.variant.sku}</td>
                      <td>৳{item.price}</td>
                      <td>{item.quantity}</td>
                      <td className="fw-bold">
                        ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-body border-top">
              <div className="row justify-content-end">
                <div className="col-md-6 col-lg-4 text-end">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Subtotal:</span>
                    <span>৳{order.subtotal}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Discount:</span>
                    <span className="text-danger">- ৳{order.discount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-primary fs-5">Total:</span>
                    <span className="fw-bold text-primary fs-5">
                      ৳{order.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Actions */}
        <div className="col-12 col-lg-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Customer Details</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-start align-items-center mb-4">
                <div className="avatar me-3 bg-label-primary p-2 rounded">
                  <i className="bx bx-user fs-3"></i>
                </div>
                <div className="d-flex flex-column">
                  <span className="fw-medium text-heading">
                    {order.user.name}
                  </span>
                  <small className="text-muted">Customer ID: #{order.id}</small>
                </div>
              </div>
              <p className="mb-1">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="mb-0">
                <strong>Phone:</strong> {order.user.phone}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 fw-bold">Shipping Address</h5>
              <i className="bx bx-map-pin text-danger fs-4"></i>
            </div>
            <div className="card-body">
              {order.shipping_address ? (
                <div className="shipping-info">
                  <p className="mb-2 fw-bold text-dark fs-6">
                    {order.shipping_address.name}
                  </p>

                  <p className="mb-2 text-muted">
                    <i className="bx bx-phone me-2 text-primary"></i>
                    {order.shipping_address.phone}
                  </p>

                  <p className="mb-2 text-muted">
                    <i className="bx bx-home-alt me-2 text-primary"></i>
                    {order.shipping_address.address}
                  </p>

                  <p className="mb-0 text-muted">
                    <i className="bx bx-buildings me-2 text-primary"></i>
                    {order.shipping_address.city} -{" "}
                    {order.shipping_address.postal_code},{" "}
                    {order.shipping_address.country}
                  </p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="avatar bg-light-warning mb-2 mx-auto">
                    <i className="bx bx-error fs-3 text-warning"></i>
                  </div>
                  <p className="text-warning mb-0 small fw-medium">
                    No shipping address found for this order.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Payment Info</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Method:</span>
                <span className="badge bg-label-info text-capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Status:</span>
                <span
                  className={`fw-bold ${
                    order.payment_status_id === 2
                      ? "text-success"
                      : "text-warning"
                  }`}
                >
                  {order.payment_status?.name ||
                    (order.payment_status_id === 2 ? "Paid" : "Pending")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOrder;
