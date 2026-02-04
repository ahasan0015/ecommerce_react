import { useState } from "react";

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  expiry_date: string;
  status: string;
}

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: "WELCOME10",
      discount_type: "percentage",
      discount_value: 10,
      min_amount: 500,
      expiry_date: "2026-12-31",
      status: "Active",
    },
    {
      id: 2,
      code: "FLAT200",
      discount_type: "fixed",
      discount_value: 200,
      min_amount: 1000,
      expiry_date: "2026-06-30",
      status: "Inactive",
    },
  ]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete coupon?")) return;
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Coupons & Discounts</h5>

          <button className="btn btn-primary btn-sm">
            + Create Coupon
          </button>
        </div>

        <div className="card-body">

          <table className="table table-bordered table-hover">

            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Amount</th>
                <th>Expiry</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>

                  <td>{coupon.code}</td>

                  <td className="text-capitalize">
                    {coupon.discount_type}
                  </td>

                  <td>
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}%`
                      : `৳${coupon.discount_value}`}
                  </td>

                  <td>৳{coupon.min_amount}</td>

                  <td>{coupon.expiry_date}</td>

                  <td>
                    <span
                      className={`badge ${
                        coupon.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td>

                    <button className="btn btn-secondary btn-sm me-2">
                      View
                    </button>

                    <button className="btn btn-warning btn-sm me-2">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ManageCoupons;
