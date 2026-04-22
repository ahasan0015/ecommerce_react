import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultBrand, type Brand } from "../../interfaces/brand.interface";
import api from "../../../config";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";

interface Status {
  id: number;
  name: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

// API থেকে আসা এরর রেসপন্সের টাইপ
interface ApiErrorResponse {
  message?: string;
  errors?: ValidationErrors;
}

const EditBrand = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [brand, setBrand] = useState<Brand>(defaultBrand);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors | null>(null);

  useEffect(() => {
    document.title = "Edit Brand";
    getInitialData();
  }, [id]);

  const getInitialData = async () => {
    try {
      const statusRes = await api.get("/product-statuses");
      const statusData: Status[] = Array.isArray(statusRes.data)
        ? statusRes.data
        : statusRes.data?.data || [];
      setStatuses(statusData);

      const brandRes = await api.get(`/brands/${id}`);
      const brandData: Brand = brandRes.data?.data || brandRes.data;
      setBrand(brandData);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Could not load data!", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors(null);

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("status_id", brand.status_id.toString());
    formData.append("_method", "PUT"); // Laravel Method Spoofing

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      await api.post(`/brands/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Brand updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/brands");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
       
        const serverError = err as AxiosError<ApiErrorResponse>;
        if (serverError.response?.status === 422) {
          const errors =
            serverError.response.data?.errors ||
            (serverError.response.data as unknown as ValidationErrors);
          setValidationErrors(errors);
        } else {
          Swal.fire("Error", "Update failed!", "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Edit Brand</h5>
              <span className="badge bg-primary rounded-pill">ID: {id}</span>
            </div>

            <div className="card-body p-4">
              {validationErrors && (
                <Alert variant="danger" className="py-2">
                  <ul className="mb-0 small">
                    {Object.entries(validationErrors).map(([key, messages]) => (
                      <li key={key}>
                        <strong>{key.replace("_", " ")}:</strong> {messages[0]}
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Brand Name</label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors?.name ? "is-invalid" : ""}`}
                    value={brand.name || ""}
                    onChange={(e) =>
                      setBrand({ ...brand, name: e.target.value })
                    }
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    className={`form-select ${validationErrors?.status_id ? "is-invalid" : ""}`}
                    value={brand.status_id || ""}
                    onChange={(e) =>
                      setBrand({ ...brand, status_id: Number(e.target.value) })
                    }
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

                <div className="mb-4">
                  <label className="form-label fw-bold">Brand Logo</label>
                  <div className="d-flex align-items-center gap-3 p-3 border rounded bg-light mb-3">
                    <img
                      src={
                        logoFile
                          ? URL.createObjectURL(logoFile)
                          : brand.logo
                            ? `http://localhost:8000/storage/${brand.logo}`
                            : "https://via.placeholder.com/80"
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
                    className={`form-control ${validationErrors?.logo ? "is-invalid" : ""}`}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <Link to="/brands" className="btn btn-outline-secondary px-4">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Brand"}
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
