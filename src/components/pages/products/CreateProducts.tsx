import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../../config";

interface Variant {
  sku: string;
  sale_price: string | number;
  stock: string | number;
  size_id: string | number;
}

interface ProductForm {
  name: string;
  category_id: string | number;
  brand_id: string | number;
  status_id: string | number;
  color_id: string | number; 
  base_price: string | number;
  description: string;
  main_image: File | null;
  gallery_images: File[];
  variants: Variant[];
}

const defaultProduct: ProductForm = {
  name: "",
  category_id: "",
  brand_id: "",
  status_id: 1,
  color_id: "",
  base_price: "",
  description: "",
  main_image: null,
  gallery_images: [],
  variants: [{ sku: "", sale_price: "", stock: "", size_id: "" }],
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>(defaultProduct);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Create Product | NextFashion";
    api.get("/categories").then((res) => setCategories(res.data.data || res.data));
    api.get("/brands").then((res) => setBrands(res.data.data || res.data));
    api.get("/colors").then((res) => setColors(res.data.data || res.data));
    api.get("/sizes").then((res) => setSizes(res.data.data || res.data));
    api.get("/product-statuses").then((res) => setStatus(res.data.data || res.data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const autoGenerateSKU = (index: number) => {
    if (!formData.name || !formData.color_id) {
      alert("Please enter product name and select color first!");
      return;
    }
    const namePrefix = formData.name.substring(0, 3).toUpperCase();
    const colorLabel = colors.find(c => c.id == formData.color_id)?.name.substring(0, 2).toUpperCase() || "XX";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newSku = `${namePrefix}-${colorLabel}-${randomNum}`;
    handleVariantChange(index, "sku", newSku);
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: "", sale_price: "", stock: "", size_id: "" }],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ডুপ্লিকেট SKU ভ্যালিডেশন
    const skus = formData.variants.map(v => v.sku.trim().toLowerCase());
    if (new Set(skus).size !== skus.length) {
      alert("Error: Duplicate SKU detected!");
      return;
    }

    if (!formData.main_image) return alert("Main image is required!");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("color_id", String(formData.color_id));
    data.append("category_id", String(formData.category_id));
    data.append("brand_id", String(formData.brand_id));
    data.append("status_id", String(formData.status_id));
    data.append("base_price", String(formData.base_price));
    data.append("description", formData.description);
    data.append("main_image", formData.main_image);

    formData.gallery_images.forEach((file) => data.append("gallery_images[]", file));
    
    formData.variants.forEach((v, i) => {
      data.append(`variants[${i}][sku]`, v.sku);
      data.append(`variants[${i}][sale_price]`, String(v.sale_price));
      data.append(`variants[${i}][stock]`, String(v.stock));
      data.append(`variants[${i}][size_id]`, String(v.size_id));
    });

    try {
      const res = await api.post("/products", data);
      if (res.data.success) {
        alert("Product Created Successfully!");
        navigate("/products");
      }
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-header border-bottom py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-primary">General Information (Required Fields)</h6>
          </div>
          <div className="card-body mt-3">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Product Name *</label>
                <input name="name" onChange={handleInputChange} type="text" className="form-control" placeholder="e.g. Cotton Polo Shirt" required />
              </div>
              
              <div className="col-md-2">
                <label className="form-label fw-bold text-danger">Global Color *</label>
                <select name="color_id" onChange={handleInputChange} className="form-select border-danger" required>
                  <option value="">Select Color</option>
                  {colors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Category *</label>
                <select name="category_id" onChange={handleInputChange} className="form-select" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Brand *</label>
                <select name="brand_id" onChange={handleInputChange} className="form-select" required>
                  <option value="">Select Brand</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Base Price *</label>
                <input name="base_price" onChange={handleInputChange} type="number" className="form-control" placeholder="0.00" required />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Main Image *</label>
                <input type="file" className="form-control" onChange={(e) => setFormData(p => ({...p, main_image: e.target.files![0]}))} required />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Gallery Images (Optional)</label>
                <input type="file" multiple className="form-control" onChange={(e) => setFormData(p => ({...p, gallery_images: Array.from(e.target.files!)}))} />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Description *</label>
                <textarea name="description" onChange={handleInputChange} className="form-control" rows={3} placeholder="Product details..." required></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3 d-flex justify-content-between border-bottom align-items-center">
            <h6 className="mb-0 fw-bold text-primary">Product Variants (Required)</h6>
            <button type="button" onClick={addVariant} className="btn btn-primary btn-sm">+ Add Size Row</button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>SKU (Unique) *</th>
                  <th>Sale Price *</th>
                  <th>Stock Qty *</th>
                  <th>Size *</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.variants.map((v, index) => (
                  <tr key={index}>
                    <td style={{ minWidth: '200px' }}>
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control" value={v.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} placeholder="SKU-001" required />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => autoGenerateSKU(index)}>Auto</button>
                      </div>
                    </td>
                    <td><input type="number" className="form-control form-control-sm" value={v.sale_price} onChange={(e) => handleVariantChange(index, "sale_price", e.target.value)} placeholder="0" required /></td>
                    <td><input type="number" className="form-control form-control-sm" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} placeholder="0" required /></td>
                    <td>
                      <select className="form-select form-select-sm" value={v.size_id} onChange={(e) => handleVariantChange(index, "size_id", e.target.value)} required>
                        <option value="">Size</option>
                        {sizes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="text-center">
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeVariant(index)} disabled={formData.variants.length === 1}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-end mb-5">
          <button type="submit" className="btn btn-success btn-lg px-5 shadow">Save Product</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;