import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../../config";

interface Variant {
  sku: string;
  sale_price: string | number;
  stock: string | number;
  color_id: string | number;
  size_id: string | number;
  image?: File | null;
}

interface ProductForm {
  name: string;
  category_id: string | number;
  brand_id: string | number;
  status_id: string | number;
  base_price: string | number;
  description: string;
  variants: Variant[];
}

const defaultProduct: ProductForm = {
  name: "",
  category_id: "",
  brand_id: "",
  status_id: 1, // Default Active
  base_price: "",
  description: "",
  variants: [
    {
      sku: "",
      sale_price: "",
      stock: "",
      color_id: "",
      size_id: "",
      image: null,
    },
  ],
};

const CreateProduct = () => {
  const navigate = useNavigate();
  // declair state
  const [formData, setFormData] = useState<ProductForm>(defaultProduct);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Create Product";
    // ১. ক্যাটাগরি ফেচ
    api.get("/categories").then((res) => {
      console.log("Categories from API:", res.data); // এটি কনসোলে প্রিন্ট করবে
      setCategories(res.data.data || res.data);
    });

    // ২. ব্র্যান্ড ফেচ
    api.get("/brands").then((res) => setBrands(res.data.data || res.data));

    // ৩. কালার ফেচ
    api.get("/colors").then((res) => setColors(res.data.data || res.data));

    // ৪. সাইজ ফেচ
    api.get("/sizes").then((res) => setSizes(res.data.data || res.data));

    //5. Product Status featch
    api.get("/product-statuses").then((res) => {
      const statusData = res.data.data || res.data;
      setStatus(statusData);
      console.log("Statuses from API:", statusData);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //handle variant Change
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: any,
  ) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  //add variant
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          sku: "",
          sale_price: "",
          stock: "",
          color_id: "",
          size_id: "",
          image: null,
        },
      ],
    });
  };

  //delete variant
  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  //from submit

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ইমেজ পাঠানোর জন্য FormData তৈরি
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category_id", String(formData.category_id));
    data.append("brand_id", String(formData.brand_id));
    data.append("status_id", String(formData.status_id));
    data.append("base_price", String(formData.base_price));
    data.append("description", formData.description);

    // ভ্যারিয়েন্টগুলো লুপ করে অ্যাপেন্ড করা
    formData.variants.forEach((v, index) => {
      data.append(`variants[${index}][sku]`, v.sku);
      data.append(`variants[${index}][sale_price]`, String(v.sale_price));
      data.append(`variants[${index}][stock]`, String(v.stock));
      data.append(`variants[${index}][status_id]`, "1");
      data.append(`variants[${index}][color_id]`, String(v.color_id));
      data.append(`variants[${index}][size_id]`, String(v.size_id));

      if (v.image) {
        data.append(`images[${index}][]`, v.image);
      }
    });

    // try catch
    api
      .post("/products", data)
      .then((res) => {
        console.log("Success Response:", res.data);
        alert("Product Created Successfully!");
        navigate("/products");
      })
      .catch((err) => {
        console.log("Error Response:", err.response?.data);
        alert("Something went wrong! Check console for details.");
      });
  };
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* ব্রেডক্রাম্ব */}
      <h4 className="fw-bold py-3 mb-4">
        <Link
          to="/products"
          className="text-muted fw-light text-decoration-none"
        >
          Products /
        </Link>{" "}
        Create
      </h4>

      <form onSubmit={handleSubmit}>
        {/* ১. জেনারেল ইনফরমেশন কার্ড */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold text-primary">General Information</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Product Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  placeholder="Enter Product Name"
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Brand</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Base Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    name="base_price" // name অবশ্যই formData-র কি (key) এর সাথে মিলতে হবে
                    value={formData.base_price}
                    onChange={handleInputChange}
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Global Status</label>
                <select
                  className="form-select"
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleInputChange}
                >
                  {status.map((st) =>(
                  <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows={4}
                  placeholder="Write something..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* ২. ভ্যারিয়েন্ট সেকশন */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
            <h6 className="mb-0 fw-bold text-primary">Product Variants</h6>
            <button
              type="button"
              onClick={addVariant}
              className="btn btn-primary btn-sm"
            >
              + Add Variant
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive text-nowrap">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-top-0">SKU *</th>
                    <th className="border-top-0">Price *</th>
                    <th className="border-top-0">Stock *</th>
                    <th className="border-top-0">Color/Size</th>
                    <th className="border-top-0">Images</th>
                    <th className="border-top-0 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.variants.map((v, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="SKU-001"
                          value={v.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={v.sale_price}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "sale_price",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="0"
                          value={v.stock}
                          onChange={(e) =>
                            handleVariantChange(index, "stock", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <select
                            className="form-select form-select-sm"
                            value={v.color_id}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "color_id",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Color</option>
                            {colors.map((color) => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                          {/* Size Select */}
                          <select
                            className="form-select form-select-sm"
                            value={v.size_id}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "size_id",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Size</option>
                            {sizes.map((size) => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "image",
                              e.target.files?.[0],
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeVariant(index)}
                        >
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

        {/* বাটন সেকশন */}
        <div className="text-end mb-5">
          <button type="button" className="btn btn-outline-secondary me-2 px-4">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-5 fw-bold shadow-sm"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
