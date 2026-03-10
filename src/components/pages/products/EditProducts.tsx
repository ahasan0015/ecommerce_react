import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../config";

interface DropdownItem {
  id: number;
  name: string;
}
interface ProductErrors {
  name?: string[];
  category_id?: string[];
  brand_id?: string[];
  status_id?: string[];
  base_price?: string[];
  image?: string[];
  description?: string[];
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ১. স্টেট ম্যানেজমেন্ট
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState<string>(""); // পুরনো ছবি দেখানোর জন্য

  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [brands, setBrands] = useState<DropdownItem[]>([]);
  const [statuses, setStatuses] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<any>({});
// ২. স্টেটে any এর বদলে ইন্টারফেসটি ব্যবহার করুন
const [errors, setErrors] = useState<ProductErrors>({});

  // ২. ড্রপডাউন এবং প্রোডাক্ট ডাটা লোড করা
  useEffect(() => {
    document.title = "Edit Product";

    // ড্রপডাউন ডাটা আনা
    api.get("/categories").then(res => setCategories(res.data.data || res.data));
    api.get("/brands").then(res => setBrands(res.data.data || res.data));
    api.get("/product-statuses").then(res => setStatuses(res.data.data || res.data));

    // এডিট করার জন্য বর্তমান প্রোডাক্টের ডাটা আনা
    if (id) {
      api.get(`/products/${id}`)
        .then((res) => {
          const p = res.data.data || res.data;
          setName(p.name);
          setCategoryId(p.category_id);
          setBrandId(p.brand_id);
          setStatusId(p.status_id);
          setBasePrice(p.base_price);
          setDescription(p.description || "");
          setOldImage(p.image); // পুরনো ইমেজের পাথ সেভ রাখা
        })
        .catch(() => {
          alert("Product not found!");
          navigate("/products");
        });
    }
  }, [id, navigate]);

  // ৩. ফাইল হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // ৪. আপডেট ফাংশন
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("brand_id", brandId);
    formData.append("status_id", statusId);
    formData.append("base_price", basePrice);
    formData.append("description", description);
    
    // লারাভেলে Multipart FormData দিয়ে PUT রিকোয়েস্ট কাজ করানোর ট্রিক
    formData.append("_method", "PUT");

    if (image) {
      formData.append("image", image);
    }

    api.post(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert(res.data.message || "Product updated successfully!");
        navigate("/products");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          alert("Update failed. Check console.");
        }
      });
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card p-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary fw-bold mb-0">Edit Product</h3>
          <Link to="/products" className="btn btn-sm btn-outline-secondary">Back to List</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold mb-1">Product Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Category</label>
              <select
                className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <div className="invalid-feedback">{errors.category_id[0]}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Brand</label>
              <select
                className={`form-select ${errors.brand_id ? "is-invalid" : ""}`}
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brand_id && <div className="invalid-feedback">{errors.brand_id[0]}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Status</label>
              <select
                className={`form-select ${errors.status_id ? "is-invalid" : ""}`}
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
              >
                {statuses.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Base Price</label>
            <input
              type="number"
              className={`form-control ${errors.base_price ? "is-invalid" : ""}`}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            {errors.base_price && <div className="invalid-feedback">{errors.base_price[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="fw-bold mb-1">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-1">Product Image</label>
            <div className="d-flex align-items-center gap-3 mb-2">
              {oldImage && !image && (
                <div className="text-center">
                  <img 
                    src={`http://localhost:8000/storage/${oldImage}`} 
                    alt="Current" 
                    className="img-thumbnail" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                  />
                  <small className="d-block text-muted">Current Image</small>
                </div>
              )}
              <input
                type="file"
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            {errors.image && <div className="invalid-feedback d-block">{errors.image[0]}</div>}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success px-5 fw-bold" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button type="button" className="btn btn-light px-4" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;