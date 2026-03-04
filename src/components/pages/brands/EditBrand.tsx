import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultBrand, type Brand } from "../../interfaces/brand.interface";
import api from "../../../config";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // ১. প্রধান ডাটা স্টেট (আপনার User ইন্টারফেস স্টাইলে)
  const [brand, setBrand] = useState<Brand>(defaultBrand);
  // ২. নতুন লোগো ফাইলের জন্য আলাদা স্টেট (ইউজার যখন কম্পিউটার থেকে ফাইল সিলেক্ট করবে)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  //৩. ড্রপডাউনের জন্য স্ট্যাটাস লিস্ট (Active, Inactive ইত্যাদি)
  const [statuses, setStatuses] = useState<any[]>([]);

  // ১. ডাটা ফেচ করা (ইফেক্ট হুক)
  useEffect(() => {
    document.title = "Edit Brand";
    getInitialData();
  }, [id]);

  const getInitialData = () => {
    // স্ট্যাটাস লিস্ট নিয়ে আসা
    api
      .get("/product-statuses")
      .then((res) => {
        console.log(res.data);
        setStatuses(res.data);
      })
      .catch((err) => console.error("Status fetch error:", err));

    // ব্র্যান্ডের পুরনো ডাটা নিয়ে আসা
    api
      .get(`/brands/${id}`)
      .then((res) => {
        // res.data সরাসরি ব্র্যান্ড অবজেক্ট (নাম, স্ট্যাটাস আইডি, লোগো পাথ থাকে)
        console.log(res.data.data);
        setBrand(res.data.data);
      })
      .catch((err) => {
        console.error("Brand fetch error:", err);
        alert("Could not load brand data!");
      });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("status_id", brand.status_id.toString());
    formData.append("_method", "PUT"); // Laravel-এর জন্য জরুরি

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    api
      .post(`/brands/${id}`, formData)
      .then(() => {
        alert("Updated!");
        navigate("/brands");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            {/* Header */}
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Edit Brand</h5>
              <span className="badge bg-primary rounded-pill">ID: {id}</span>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Brand Name Input */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Brand Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={brand.name || ""} // ডাটা বাইন্ডিং
                    onChange={(e) =>
                      setBrand({ ...brand, name: e.target.value })
                    } // স্টেট আপডেট
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    className="form-select"
                    value={brand.status_id || ""}
                    onChange={(e) =>
                      setBrand({ ...brand, status_id: Number(e.target.value) })
                    }
                  >
                    <option value="">Select Status</option>
                    {statuses.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Logo Section */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Brand Logo</label>

                  {/* Static Preview Area */}
                  <div className="d-flex align-items-center gap-3 p-3 border rounded bg-light mb-3">
                    <img
                      src={
                        logoFile
                          ? URL.createObjectURL(logoFile) // ১. নতুন সিলেক্ট করা ফাইল থাকলে সেটির প্রিভিউ
                          : brand.logo
                            ? `http://localhost:8000/storage/${brand.logo}` // ২. সার্ভারের ইমেজের পূর্ণ লিঙ্ক
                            : "https://via.placeholder.com/80" // ৩. কিছু না থাকলে প্লেসহোল্ডার
                      }
                      alt="Brand"
                      className="img-thumbnail"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="small text-muted">
                      Current logo preview. <br />
                      Choose a new file to change.
                    </div>
                  </div>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                <hr className="my-4" />

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <Link to="/brands" className="btn btn-outline-secondary px-4">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm"
                  >
                    Update Brand
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBrand;
