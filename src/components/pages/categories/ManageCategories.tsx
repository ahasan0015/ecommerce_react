import { useEffect, useState } from "react";

import api from "../../../config";
import type { Category } from "../../interfaces/category.interface";
import { NavLink } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  

  const fetchCategories = () => {
    
    api
      .get(`/categories`)
      .then((res) => {
        if (res.data.success) {
          // লারাভেল থেকে আসা ডাটা সেভ করা
          setCategories(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      })
      
  };

  // ৩. ইউজ ইফেক্ট
  useEffect(() => {
    document.title = "Manage Categories";
    fetchCategories();
  }, []);

  const handleDelete = (id: number | undefined) => {
    if (!id) return;

    // ইউজার থেকে কনফার্মেশন নেওয়া
    if (window.confirm("Are you sure you want to delete this category?")) {
      api
        .delete(`/categories/${id}`)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            // ডিলিট হওয়ার পর টেবিল লিস্ট রিফ্রেশ করা
            fetchCategories();
          } else {
            alert("Delete failed: " + res.data.message);
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
          <h3 className="fw-bold">Categories List</h3>
          <p className="text-muted">
            Manage your clothing store categories manually here.
          </p>
        </div>
        <NavLink to={'/categories/create'} className="btn btn-primary px-4 shadow-sm">
          + Add Category
        </NavLink>
      </div>

      {/* Static Table Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Category Name</th>
                {/* <th>Brand</th> */}
                <th>Slug</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Static Row 1 */}
              {categories.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="ps-4">{index + 1}</td>
                  <td>
                    <span className="fw-bold">{item.name}</span>
                  </td>
                  {/* <td>
                    <span className="badge bg-info text-dark bg-opacity-10">
                      {item.brand_name}
                    </span>
                  </td> */}
                  <td>
                    <code>{item.slug}</code>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill ${item.status_id === 1 ? "bg-success" : "bg-danger"}`}>
                      {item.status_name}
                    </span>
                  </td>
                  <td className="text-center">
                    <NavLink to="/categories/edit/:id" className="btn btn-sm btn-outline-warning me-2">
                      Edit
                    </NavLink>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">
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

export default ManageCategories;
