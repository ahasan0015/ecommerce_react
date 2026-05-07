import { useEffect, useState } from "react";
import api from "../../../config";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";


/* ================= TYPES ================= */

interface Variant {
  variant_id: number;
  sku: string;
  sale_price: string;
  stock: number;
  color: string;
  size: string;
}

interface Product {
  product_id: number;
  product_name: string;
  slug: string;
  description: string;
  category_name: string;
  brand_name: string;
  status_name: string;
  variants: Variant[];
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
}

/* ================= COMPONENT ================= */

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  /* ================= FETCH ================= */

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);

    try {
      const res = await api.get<ApiResponse>(`/products?page=${page}`);

      if (res.data?.success) {
        setProducts(res.data.data ?? []);
        setCurrentPage(res.data.current_page ?? 1);
        setLastPage(res.data.last_page ?? 1);
        setTotal(res.data.total ?? 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    document.title = "Manage Products";
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((p) => p.product_id !== id));

      Swal.fire("Success", "Product moved to trash!", "success");
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setProducts((prev) => prev.filter((p) => p.product_id !== id));
      } else {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Products List</h3>
          <p className="text-muted">
            Manage your clothing store products here.
          </p>
        </div>

        <div>
          <NavLink
            to="/products/trash"
            className="btn btn-outline-secondary me-2"
          >
            <i className="fa fa-trash"></i> View Trash
          </NavLink>

          <NavLink
            to="/products/create"
            className="btn btn-primary px-4 shadow-sm"
          >
            + Add Product
          </NavLink>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">SL</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price (Base)</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((item, index) => {
                    const basePrice = item.variants?.[0]?.sale_price
                      ? Number(item.variants[0].sale_price).toFixed(2)
                      : "0.00";

                    return (
                      <tr key={item.product_id}>
                        <td className="ps-4">
                          {(currentPage - 1) * 10 + (index + 1)}
                        </td>

                        <td>
                          <span className="fw-bold d-block">
                            {item.product_name}
                          </span>
                          <small className="text-muted">{item.slug}</small>
                        </td>

                        <td>
                          <span className="badge bg-info text-dark bg-opacity-10">
                            {item.category_name}
                          </span>
                        </td>

                        <td>{item.brand_name}</td>

                        <td>{basePrice}</td>

                        <td className="text-center">
                          <span
                            className={`badge rounded-pill ${
                              item.status_name === "Active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {item.status_name}
                          </span>
                        </td>

                        <td className="text-center">
                          <NavLink
                            to={`/variants/products/${item.product_id}`}
                            className="btn btn-sm btn-outline-info me-2"
                          >
                            Variants
                          </NavLink>

                          <NavLink
                            to={`/products/${item.product_id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Details
                          </NavLink>

                          <NavLink
                            to={`/products/edit/${item.product_id}`}
                            className="btn btn-sm btn-outline-warning me-2"
                          >
                            Edit
                          </NavLink>

                          <button
                            onClick={() => handleDelete(item.product_id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PAGINATION ================= */}

        <div className="card-footer bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing page <strong>{currentPage}</strong> of{" "}
              <strong>{lastPage}</strong> (Total: {total})
            </div>

            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  currentPage === lastPage ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;