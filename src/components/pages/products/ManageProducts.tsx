import { useEffect, useState } from "react";
import api from "../../../config"; // আপনার এপিআই কনফিগ
import { NavLink } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  category_id: number;
  brand_id: number;
  status_id: number;
  category_name?: string;
  brand_name?: string;
  status_name?: string;
  category?: { name: string };
  brand?: { name: string };
  status?: { name: string };
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // পাজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // ডাটা ফেচ করার ফাংশন (page নাম্বার সহ)
  const fetchProducts = (page: number = 1) => {
    setLoading(true);
    api
      .get(`/products?page=${page}`) // লারাভেল অটোমেটিক ?page= বুঝতে পারে
      .then((res) => {
        if (res.data.success) {
          // লারাভেল paginate(10) ব্যবহার করলে ডাটা res.data.data এর ভেতরে থাকে
          const responseData = res.data.data;
          setProducts(responseData.data);
          setCurrentPage(responseData.current_page);
          setLastPage(responseData.last_page);
          setTotal(responseData.total);
        }
        
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = "Manage Products";
    fetchProducts(currentPage);
  }, [currentPage]); // currentPage পরিবর্তন হলে অটোমেটিক কল হবে

  const handleDelete = (id: number | undefined) => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      api
        .delete(`/products/${id}`)
        .then((res) => {
          if (res.data.success || res.status === 200) {
            alert(res.data.message || "Product deleted successfully");
            fetchProducts(currentPage); // বর্তমান পেজটি রিফ্রেশ করা
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Something went wrong while deleting.");
        });
    }
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Products List</h3>
          <p className="text-muted">Manage your clothing store products here.</p>
        </div>
        <NavLink to={"/products/create"} className="btn btn-primary px-4 shadow-sm">
          + Add Product
        </NavLink>
      </div>

      {/* Table Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>image</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">Loading products...</td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((item, index) => (
                    <tr key={item.id}>
                      <td className="ps-4">{(currentPage - 1) * 10 + (index + 1)}</td>
                      <td>
                        <span className="fw-bold d-block">{item.name}</span>
                        <small className="text-muted">{item.slug}</small>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark bg-opacity-10">
                          {item.category_name || item.category?.name || "N/A"}
                        </span>
                      </td>
                      <td>{item.brand_name || item.brand?.name || "N/A"}</td>
                      <td>{Number(item.base_price).toFixed(2)}</td>
                      {/* <td>{item.}</td> */}
                      <td className="text-center">
                        <span className={`badge rounded-pill ${item.status_id === 1 ? "bg-success" : "bg-danger"}`}>
                          {item.status_name || item.status?.name || "N/A"}
                        </span>
                      </td>
                      <td className="text-center">
                         <NavLink to={`/products/${item.id}`} className="btn btn-sm btn-outline-primary me-2">
                          Details
                        </NavLink>
                        <NavLink to={`/products/edit/${item.id}`} className="btn btn-sm btn-outline-warning me-2">
                          Edit
                        </NavLink>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bootstrap Pagination UI */}
        <div className="card-footer bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Showing page <strong>{currentPage}</strong> of <strong>{lastPage}</strong> (Total <strong>{total}</strong> products)
            </div>
            
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {[...Array(lastPage)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                {/* Next Button */}
                <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === lastPage}>
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