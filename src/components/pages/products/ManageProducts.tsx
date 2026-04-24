import { useEffect, useState } from "react";
import api from "../../../config"; 
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";


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

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchProducts = (page: number = 1) => {
    setLoading(true);
    api
      .get(`/products?page=${page}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data || []);
          setCurrentPage(res.data.current_page || 1);
          setLastPage(res.data.last_page || 1);
          setTotal(res.data.total || 0);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = "Manage Products";
    fetchProducts(currentPage);
  }, [currentPage]);

  //delete product

  const handleDelete = (id: number) => {
    api
      .delete(`/products/${id}`)
      .then((res) => {
        setProducts((prev) => prev.filter((p) => p.product_id !== id));
        Swal.fire("Success", "Product moved to trash!", "success");
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setProducts((prev) => prev.filter((p) => p.product_id !== id));
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Products List</h3>
          <p className="text-muted">
            Manage your clothing store products here.
          </p>
        </div>
        <NavLink
          to="/products/trash"
          className="btn btn-outline-secondary me-2"
        >
          <i className="fa fa-trash"></i> View Trash
        </NavLink>
        <NavLink
          to={"/products/create"}
          className="btn btn-primary px-4 shadow-sm"
        >
          + Add Product
        </NavLink>
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
                  products.map((item, index) => (
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
                      <td>
                        {item.variants && item.variants.length > 0
                          ? Number(item.variants[0].sale_price).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill ${item.status_name === "Active" ? "bg-success" : "bg-danger"}`}
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
                  ))
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

        {/* Pagination UI */}
        <div className="card-footer bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing page <strong>{currentPage}</strong> of{" "}
              <strong>{lastPage}</strong>
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {/* পাজিনেশন বাটনগুলো এখানে অটোমেটিক জেনারেট হবে */}
                {[...Array(lastPage)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
