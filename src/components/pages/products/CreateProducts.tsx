import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config";

// ড্রপডাউন ডাটার জন্য টাইপ ডিফাইন করা (TS Error হ্যান্ডেল করতে)
interface DropdownItem {
  id: number;
  name: string;
}

const ProductCreate = () => {
  const navigate = useNavigate();

  // ১. ইনপুট ফিল্ডের জন্য আলাদা আলাদা স্টেট (Beginner Style)
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  // ২. ড্রপডাউন ডাটা স্টোর করার স্টেট (ইন্টারফেস সহ)
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [brands, setBrands] = useState<DropdownItem[]>([]);
  const [statuses, setStatuses] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ৩. পেজ লোড হওয়ার সময় ড্রপডাউন ডাটা নিয়ে আসা
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [catRes, brandRes, statusRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
          api.get("/product-statuses"),
        ]);

        // লারাভেল রেসপন্স অনুযায়ী ডাটা সেট করা
        setCategories(catRes.data.data || catRes.data);
        setBrands(brandRes.data.data || brandRes.data);
        setStatuses(statusRes.data.data || statusRes.data);
      } catch (err) {
        console.error("Dropdown load failed:", err);
      }
    };
    loadDropdowns();
  }, []);

  // ৪. ফাইল হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // ৫. সাবমিট ফাংশন
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("brand_id", brandId);
    formData.append("status_id", statusId);
    formData.append("base_price", basePrice);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    api
      .post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert(res.data.message || "Product created successfully!");
        navigate("/products");
      })
      .catch((err) => {
        console.error("Submission Error:", err.response?.data);
        alert("Something went wrong. Check inputs.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm border-0">
        <h3 className="mb-4 text-primary">Create New Product</h3>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-3">
            <label className="fw-bold">Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="row">
            {/* Category Dropdown */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Category</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Brand</label>
              <select
                className="form-select"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Status</label>
              <select
                className="form-select"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                {statuses.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Base Price */}
          <div className="mb-3">
            <label className="fw-bold">Base Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="0.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="fw-bold">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Product details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="fw-bold">Product Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold" 
            disabled={loading}
          >
            {loading ? "Saving Product..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;