import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../../config"; // আপনার বেস ইউআরএল কনফিগ
import Swal from "sweetalert2";

interface Brand {
  id: number;
  name: string;
  logo: string | null;
  status_name: string; // Join এর মাধ্যমে আসা স্ট্যাটাস নাম
  status_id: number;
}

const ManageBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ইমেজ প্রিভিউ করার জন্য বেস ইউআরএল (আপনার লারাভেল ইউআরএল অনুযায়ী পরিবর্তন করুন)
  const storageUrl = "http://localhost:8000/storage/";

  const fetchBrands = (page: number = 1) => {
    api
      .get(`/brands?page=${page}`)
      .then((res) => {
        // লারাভেল পাজিনেশন ডাটা হ্যান্ডেলিং
        // যদি পাজিনেশন না থাকে তবে সরাসরি res.data দিন
        const data = res.data.data || res.data;
        setBrands(Array.isArray(data) ? data : data.data);

        if (res.data.last_page) {
          setTotalPages(res.data.last_page);
          setCurrentPage(res.data.current_page);
        }
      })
      .catch((err) => console.error("Error fetching brands:", err));
  };

  useEffect(() => {
    document.title = "Manage Brands";
    fetchBrands(currentPage);
  }, [currentPage]);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Brand and its logo will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/brands/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Brand has been deleted.", "success");
            fetchBrands(currentPage);
          })
          .catch(() => Swal.fire("Error!", "Failed to delete brand.", "error"));
      }
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold">Brand Management</h5>
          <NavLink to="/brands/create" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg"></i> + Add Brand
          </NavLink>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>S.L</th>
                  <th>Logo</th>
                  <th>Brand Name</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length > 0 ? (
                  brands.map((brand, index) => (
                    <tr key={brand.id}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>
                      <td>
                        {brand.logo ? (
                          <img
                            src={`${storageUrl}${brand.logo}`}
                            alt={brand.name}
                            className="img-thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span className="text-muted small">No Logo</span>
                        )}
                      </td>
                      <td className="fw-semibold">{brand.name}</td>
                      <td>
                        <span
                          className={`badge ${brand.status_name === "Active" ? "bg-success" : "bg-secondary"}`}
                        >
                          {brand.status_name}
                        </span>
                      </td>
                      <td className="text-center">
                        <NavLink
                          to={`/brands/edit/${brand.id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          Edit
                        </NavLink>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(brand.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No brands found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBrands;
