// ==========3==============
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../config";

// interface MasterData { id: number; name: string; }
// interface Variant {
//   size_id: string;
//   color_id: string;
//   sale_price: string;
//   stock: string;
//   sku: string;
//   status_id: string;
//   images: File[];
// }

// const CreateProduct = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   // --- Main Product State ---
//   const [name, setName] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [brandId, setBrandId] = useState("");
//   const [statusId, setStatusId] = useState(""); // Main Status
//   const [basePrice, setBasePrice] = useState("");
//   const [description, setDescription] = useState("");

//   // --- Variants State ---
//   const [variants, setVariants] = useState<Variant[]>([
//     { size_id: "", color_id: "", sale_price: "", stock: "", sku: "", status_id: "1", images: [] }
//   ]);

//   // --- Master Data State ---
//   const [master, setMaster] = useState({
//     categories: [] as MasterData[],
//     brands: [] as MasterData[],
//     statuses: [] as MasterData[],
//     sizes: [] as MasterData[],
//     colors: [] as MasterData[]
//   });

//   // ১. ড্রপডাউন ডাটা লোড করা
//   useEffect(() => {
//     const fetchMasterData = async () => {
//       try {
//         const [cat, brnd, sts, sz, clr] = await Promise.all([
//           api.get("/categories"), 
//           api.get("/brands"), 
//           api.get("/product-statuses"), 
//           api.get("/sizes"), 
//           api.get("/colors"),
//         ]);
//         setMaster({
//           categories: cat.data.data || [],
//           brands: brnd.data.data || [],
//           statuses: sts.data.data || [],
//           sizes: sz.data.data || [],
//           colors: clr.data.data || [],
//         });
//       } catch (err) { 
//         console.error("Master data load error", err); 
//       }
//     };
//     fetchMasterData();
//   }, []);

//   const addVariant = () => {
//     setVariants([...variants, { size_id: "", color_id: "", sale_price: "", stock: "", sku: "", status_id: "1", images: [] }]);
//   };

//   const removeVariant = (index: number) => {
//     setVariants(variants.filter((_, i) => i !== index));
//   };

//   const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
//     const updated = [...variants];
//     updated[index] = { ...updated[index], [field]: value };
//     setVariants(updated);
//   };

//   // ২. সাবমিট ফাংশন
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("category_id", categoryId);
//     formData.append("brand_id", brandId);
//     formData.append("status_id", statusId); 
//     formData.append("base_price", basePrice); 
//     formData.append("description", description);

//     // ইমেজ ছাড়া বাকি ভেরিয়েন্ট ডাটা JSON হিসেবে
//     const variantsTextOnly = variants.map(({ images, ...rest }) => rest);
//     formData.append("variants", JSON.stringify(variantsTextOnly));

//     // প্রতিটি ভেরিয়েন্টের জন্য ইমেজ পাঠানো
//     variants.forEach((v, vIdx) => {
//       v.images.forEach((file, imgIdx) => {
//         formData.append(`variants.${vIdx}.images.${imgIdx}`, file);
//       });
//     });

//     try {
//       const res = await api.post("/products", formData, {
//         headers: { "Content-Type": "multipart/form-data", "Accept": "application/json" },
//       });
//       alert(res.data.message);
//       navigate("/products");
//     } catch (err: any) {
//       if (err.response?.status === 422) {
//         setErrors(err.response.data.errors);
//       } else {
//         alert("Server Error! Check Console.");
//       }
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   return (
//     <div className="container py-4">
//       <div className="card shadow-sm border-0 p-4">
//         <h4 className="fw-bold text-primary mb-4">Add New Product</h4>
//         <form onSubmit={handleSubmit}>
          
//           <div className="row g-3 mb-3">
//             <div className="col-md-6">
//               <label className="form-label fw-bold">Product Name</label>
//               <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} 
//                 value={name} onChange={(e) => setName(e.target.value)} />
//               {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
//             </div>

//             <div className="col-md-3">
//               <label className="form-label fw-bold">Category</label>
//               <select className={`form-select ${errors.category_id ? "is-invalid" : ""}`} 
//                 value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
//                 <option value="">Select Category</option>
//                 {master.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label className="form-label fw-bold">Brand</label>
//               <select className={`form-select ${errors.brand_id ? "is-invalid" : ""}`} 
//                 value={brandId} onChange={(e) => setBrandId(e.target.value)}>
//                 <option value="">Select Brand</option>
//                 {master.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//               </select>
//             </div>
//           </div>

//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
//               <label className="form-label fw-bold">Base Price (TK)</label>
//               <input type="number" className={`form-control ${errors.base_price ? "is-invalid" : ""}`} 
//                 value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
//               {errors.base_price && <div className="invalid-feedback">{errors.base_price[0]}</div>}
//             </div>

//             <div className="col-md-4">
//               <label className="form-label fw-bold">Main Product Status</label>
//               <select className={`form-select ${errors.status_id ? "is-invalid" : ""}`} 
//                 value={statusId} onChange={(e) => setStatusId(e.target.value)}>
//                 <option value="">Select Status</option>
//                 {master.statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//               {errors.status_id && <div className="invalid-feedback">{errors.status_id[0]}</div>}
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="form-label fw-bold">Product Description</label>
//             <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
//           </div>

//           <hr />
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="mb-0 text-secondary">Manage Variants</h5>
//             <button type="button" className="btn btn-dark btn-sm shadow-sm" onClick={addVariant}>+ Add Variant</button>
//           </div>

//           {/* --- Variants Section --- */}
//           {variants.map((v, index) => (
//             <div key={index} className="border rounded p-3 mb-3 bg-white shadow-sm position-relative">
//               {variants.length > 1 && (
//                 <button type="button" className="btn-close position-absolute top-0 end-0 m-2" onClick={() => removeVariant(index)}></button>
//               )}
//               <div className="row g-2 align-items-end">
//                 <div className="col-md-2">
//                   <label className="small fw-bold">Size</label>
//                   <select className="form-select form-select-sm" value={v.size_id} onChange={(e) => handleVariantChange(index, "size_id", e.target.value)}>
//                     <option value="">Size</option>
//                     {master.sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                   </select>
//                 </div>
//                 <div className="col-md-2">
//                   <label className="small fw-bold">Color</label>
//                   <select className="form-select form-select-sm" value={v.color_id} onChange={(e) => handleVariantChange(index, "color_id", e.target.value)}>
//                     <option value="">Color</option>
//                     {master.colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   </select>
//                 </div>
//                 <div className="col-md-2">
//                   <label className="small fw-bold">Sale Price</label>
//                   <input type="number" className="form-control form-control-sm" placeholder="Price" value={v.sale_price} onChange={(e) => handleVariantChange(index, "sale_price", e.target.value)} />
//                 </div>
//                 <div className="col-md-1">
//                   <label className="small fw-bold">Stock</label>
//                   <input type="number" className="form-control form-control-sm" placeholder="Qty" value={v.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} />
//                 </div>
//                 <div className="col-md-2">
//                   <label className="small fw-bold">Variant Status</label>
//                   <select className="form-select form-select-sm" value={v.status_id} onChange={(e) => handleVariantChange(index, "status_id", e.target.value)}>
//                     <option value="1">Active</option>
//                     <option value="0">Inactive</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="small fw-bold">Images</label>
//                   <input type="file" multiple className="form-control form-control-sm" 
//                     onChange={(e) => handleVariantChange(index, "images", Array.from(e.target.files || []))} />
//                 </div>
//               </div>
//             </div>
//           ))}

//           <button type="submit" className="btn btn-primary w-100 py-2 mt-3 fw-bold shadow-sm" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2"></span>
//                 Saving...
//               </>
//             ) : "Save Product & Variants"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProduct;

// ==========2==============

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config";
interface ValidationErrors {
  [key: string]: string[]; 
}
interface DropdownItem {
  id: number;
  name: string;
}

const ProductCreate = () => {
  const navigate = useNavigate();

  // ১. ইনপুট স্টেট
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  // ২. ডাটা এবং এরর স্টেট
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [brands, setBrands] = useState<DropdownItem[]>([]);
  const [statuses, setStatuses] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});// ব্যাকএন্ড থেকে আসা এরর স্টোর করবে

  // ৩. পেজ লোড হওয়ার সময় ড্রপডাউন ডাটা আনা (.then ব্যবহার করে)
  useEffect(() => {
    // ক্যাটাগরি লোড
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data || res.data))
      .catch((err) => console.error("Category Load Error", err));

    // ব্র্যান্ড লোড
    api
      .get("/brands")
      .then((res) => setBrands(res.data.data || res.data))
      .catch((err) => console.error("Brand Load Error", err));

    // স্ট্যাটাস লোড
    api
      .get("/product-statuses")
      .then((res) => setStatuses(res.data.data || res.data))
      .catch((err) => console.error("Status Load Error", err));
  }, []);

  // ৪. ফাইল হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // ৫. সাবমিট ফাংশন (.then এবং .catch চেইন)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // নতুন করে সাবমিট করার আগে আগের এরর মুছে ফেলা

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

    // API POST Request
    api
      .post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert(res.data.message || "Product created successfully!");
        setLoading(false);
        navigate("/products");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          // লারাভেল থেকে আসা স্পেসিফিক এররগুলো স্টেটে সেট করা
          console.log("Validation Errors:", err.response.data.errors);
          setErrors(err.response.data.errors);
        } else {
          console.error("Submission Error:", err.response?.data);
          alert("Something went wrong. Check console.");
        }
      });
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card p-4 shadow-sm border-0">
        <h3 className="mb-4 text-primary fw-bold">Create New Product</h3>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Product Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name[0]}</div>
            )}
          </div>

          <div className="row">
            {/* Category */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Category</label>
              <select
                className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <div className="invalid-feedback">{errors.category_id[0]}</div>
              )}
            </div>

            {/* Brand */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Brand</label>
              <select
                className={`form-select ${errors.brand_id ? "is-invalid" : ""}`}
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand_id && (
                <div className="invalid-feedback">{errors.brand_id[0]}</div>
              )}
            </div>

            {/* Status */}
            <div className="col-md-4 mb-3">
              <label className="fw-bold mb-1">Status</label>
              <select
                className={`form-select ${errors.status_id ? "is-invalid" : ""}`}
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
              >
                <option value="">Select Status</option>
                {statuses.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
              {errors.status_id && (
                <div className="invalid-feedback">{errors.status_id[0]}</div>
              )}
            </div>
          </div>

          {/* Base Price */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Base Price</label>
            <input
              type="number"
              className={`form-control ${errors.base_price ? "is-invalid" : ""}`}
              placeholder="0.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            {errors.base_price && (
              <div className="invalid-feedback">{errors.base_price[0]}</div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Description</label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              rows={3}
              placeholder="Product details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && (
              <div className="invalid-feedback">{errors.description[0]}</div>
            )}
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="fw-bold mb-1">Product Image</label>
            <input
              type="file"
              className={`form-control ${errors.image ? "is-invalid" : ""}`}
              onChange={handleFileChange}
              accept="image/*"
            />
            {errors.image && (
              <div className="invalid-feedback">{errors.image[0]}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 py-2 fw-bold"
              disabled={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              {loading ? "Saving..." : "Save Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-dark px-4"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../config"; // আপনার axios কনফিগ

// const ProductCreate = () => {
//   const navigate = useNavigate();

//   // ১. স্প্রেড অপারেটর ব্যবহারের জন্য সব টেক্সট ফিল্ড একটি অবজেক্টে
//   const [formData, setFormData] = useState({
//     name: "",
//     category_id: "",
//     brand_id: "",
//     status_id: "",
//     base_price: "",
//     description: "",
//   });

//   // ফাইল এবং ড্রপডাউন ডাটার জন্য আলাদা স্টেট
//   const [image, setImage] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ২. ড্রপডাউন ডাটা লোড করা
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, brandRes, statusRes] = await Promise.all([
//           api.get("/categories"),
//           api.get("/brands"),
//           api.get("/product-statuses"),
//         ]);
//         setCategories(catRes.data.data || catRes.data);
//         setBrands(brandRes.data.data || brandRes.data);
//         setStatuses(statusRes.data.data || statusRes.data);
//       } catch (err) {
//         console.error("Error loading dropdowns:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // ৩. কমন ইনপুট হ্যান্ডলার (Spread Operator-এর জাদু এখানে)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,       // আগের সব ডাটা কপি করে রাখা
//       [name]: value,     // শুধুমাত্র নির্দিষ্ট ইনপুটটি আপডেট করা
//     });
//   };

//   // ৪. ফাইল হ্যান্ডলার
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   // ৫. সাবমিট ফাংশন
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     // অবজেক্ট থেকে সব ডাটা লুপ চালিয়ে FormData-তে নেওয়া
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });

//     if (image) {
//       data.append("image", image);
//     }

//     api.post("/products", data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//     .then((res) => {
//       alert(res.data.message || "Product saved successfully!");
//       navigate("/products");
//     })
//     .catch((err) => {
//       console.error(err.response?.data);
//       alert("Validation Error! Please check your inputs.");
//     })
//     .finally(() => setLoading(false));
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card shadow-sm border-0 col-md-10 mx-auto">
//         <div className="card-header bg-dark text-white p-3">
//           <h4 className="mb-0">Add New Product</h4>
//         </div>
//         <div className="card-body p-4">
//           <form onSubmit={handleSubmit}>

//             {/* Product Name */}
//             <div className="mb-3">
//               <label className="form-label fw-bold">Product Name</label>
//               <input
//                 type="text"
//                 name="name" // স্টেট এর 'name' এর সাথে মিল থাকতে হবে
//                 className="form-control"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="row">
//               {/* Category */}
//               <div className="col-md-4 mb-3">
//                 <label className="form-label fw-bold">Category</label>
//                 <select
//                   name="category_id"
//                   className="form-select"
//                   value={formData.category_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Brand */}
//               <div className="col-md-4 mb-3">
//                 <label className="form-label fw-bold">Brand</label>
//                 <select
//                   name="brand_id"
//                   className="form-select"
//                   value={formData.brand_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Brand</option>
//                   {brands.map((brand) => (
//                     <option key={brand.id} value={brand.id}>{brand.name}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status */}
//               <div className="col-md-4 mb-3">
//                 <label className="form-label fw-bold">Status</label>
//                 <select
//                   name="status_id"
//                   className="form-select"
//                   value={formData.status_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Status</option>
//                   {statuses.map((st) => (
//                     <option key={st.id} value={st.id}>{st.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="mb-3">
//               <label className="form-label fw-bold">Base Price</label>
//               <input
//                 type="number"
//                 name="base_price"
//                 className="form-control"
//                 value={formData.base_price}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="mb-3">
//               <label className="form-label fw-bold">Description</label>
//               <textarea
//                 name="description"
//                 className="form-control"
//                 rows="3"
//                 value={formData.description}
//                 onChange={handleChange}
//               ></textarea>
//             </div>

//             {/* Image Upload */}
//             <div className="mb-4">
//               <label className="form-label fw-bold">Product Image</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 onChange={handleFileChange}
//               />
//             </div>

//             <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={loading}>
//               {loading ? "Saving..." : "Create Product"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCreate;
