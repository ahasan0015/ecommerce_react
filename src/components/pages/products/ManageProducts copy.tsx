import { useState } from "react";

interface Status { id: number; name: string; }
interface Category { id: number; name: string; }
interface Brand { id: number; name: string; }

interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  brand_id: number;
  base_price: number;
  status_id: number;
  created_at: string;
}

const ManageProducts = () => {
  // Static data for statuses, categories, brands
  const statuses: Status[] = [
    { id: 1, name: "Active" },
    { id: 2, name: "Inactive" },
  ];

  const categories: Category[] = [
    { id: 1, name: "Men" },
    { id: 2, name: "Women" },
    { id: 3, name: "Shirts" },
  ];

  const brands: Brand[] = [
    { id: 1, name: "Brand A" },
    { id: 2, name: "Brand B" },
  ];

  // Static products
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Men Shirt Blue", slug: "men-shirt-blue", category_id: 3, brand_id: 1, base_price: 25.5, status_id: 1, created_at: "2026-02-04" },
    { id: 2, name: "Women Dress Red", slug: "women-dress-red", category_id: 2, brand_id: 2, base_price: 45.0, status_id: 1, created_at: "2026-02-03" },
    { id: 3, name: "Men T-Shirt", slug: "men-tshirt", category_id: 1, brand_id: 1, base_price: 15.0, status_id: 2, created_at: "2026-02-02" },
  ]);

  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || "-";
  const getBrandName = (id: number) => brands.find(b => b.id === id)?.name || "-";
  const getStatusName = (id: number) => statuses.find(s => s.id === id)?.name || "";
  const getStatusBadgeClass = (id: number) => (id === 1 ? "bg-success" : "bg-danger");

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Products Management</h5>
          <button className="btn btn-primary">+ Add Product</button>
        </div>

        <div className="card-body">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price ($)</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.slug}</td>
                  <td>{getCategoryName(p.category_id)}</td>
                  <td>{getBrandName(p.brand_id)}</td>
                  <td>{p.base_price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(p.status_id)}`}>
                      {getStatusName(p.status_id)}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-secondary btn-sm me-2">View</button>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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

export default ManageProducts;
