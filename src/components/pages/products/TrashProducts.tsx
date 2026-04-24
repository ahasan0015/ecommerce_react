import { useEffect, useState } from "react";
import api from "../../../config";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom"; 

interface TrashProduct {
  product_id: number;
  product_name: string;
  category_name: string;
  deleted_at: string;
}

const TrashProducts = () => {
  const [products, setProducts] = useState<TrashProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrash = () => {
    setLoading(true);
    api
      .get("/products/trash")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error("Error fetching trash:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Recycle Bin - Products";
    fetchTrash();
  }, []);

  // Restore Function
  const handleRestore = (id: number) => {
    api.post(`/products/${id}/restore`).then(() => {
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
      Swal.fire("Restored!", "Product is back in active list.", "success");
    });
  };

  // Permanent Delete Function
  const handleForceDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the product permanently from the database!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete Forever!",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/products/${id}/force-delete`).then(() => {
          setProducts((prev) => prev.filter((p) => p.product_id !== id));
          Swal.fire("Deleted!", "Product has been wiped out.", "success");
        });
      }
    });
  };

  return (
    <div className="container mt-5">
      {/* হেডার সেকশন উইথ ব্যাক বাটন */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger">Recycle Bin</h3>
          <p className="text-muted mb-0">
            You can restore or permanently remove items from here.
          </p>
        </div>

        {/* ✅ প্রফেশনাল ব্যাক বাটন */}
        <NavLink to="/products" className="btn btn-outline-dark shadow-sm px-4">
          <i className="fa fa-arrow-left me-2"></i> Back to Products
        </NavLink>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Product Name</th>
                <th>Category</th>
                <th>Deleted At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading Trash...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.product_id}>
                    <td className="ps-4 fw-bold">{item.product_name}</td>
                    <td>{item.category_name}</td>
                    <td>{new Date(item.deleted_at).toLocaleString()}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRestore(item.product_id)}
                        className="btn btn-sm btn-outline-success me-2 shadow-sm"
                      >
                        <i className="fa fa-undo me-1"></i> Restore
                      </button>
                      <button
                        onClick={() => handleForceDelete(item.product_id)}
                        className="btn btn-sm btn-outline-danger shadow-sm"
                      >
                        <i className="fa fa-times me-1"></i> Delete Forever
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <i className="fa fa-trash-o fa-3x mb-3 d-block"></i>
                    Trash is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrashProducts;
