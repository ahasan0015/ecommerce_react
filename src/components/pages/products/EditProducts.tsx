import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../config";
import { Spinner, Button, Card, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";


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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // state
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState<string>("");

  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const [brands, setBrands] = useState<DropdownItem[]>([]);
  const [statuses, setStatuses] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ProductErrors>({});

  const storageUrl = "http://localhost:8000/storage/";

 
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes, statusRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
          api.get("/product-statuses"),
          api.get(`/products/${id}`),
        ]);

        setCategories(catRes.data.data || catRes.data);
        setBrands(brandRes.data.data || brandRes.data);
        setStatuses(statusRes.data.data || statusRes.data);

        const p = prodRes.data.data;
        setName(p.name);
        setCategoryId(p.category_id.toString());
        setBrandId(p.brand_id.toString());
        setStatusId(p.status_id.toString());
        setBasePrice(p.base_price.toString());
        setDescription(p.description || "");
        setOldImage(p.main_image || p.image); 
      } catch (err) {
        console.error("Initialization Error:", err);
        Swal.fire("Error", "Failed to load product data", "error");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, navigate]);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("brand_id", brandId);
    formData.append("status_id", statusId);
    formData.append("base_price", basePrice);
    formData.append("description", description);

    formData.append("_method", "PUT");

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await api.post(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire(
          "Updated!",
          "Product has been updated successfully.",
          "success",
        );
        navigate("/products");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        Swal.fire(
          "Validation Error",
          "Please check the form for errors.",
          "warning",
        );
      } else {
        Swal.fire(
          "Update Failed",
          "Something went wrong on the server.",
          "error",
        );
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0 text-primary">
            Edit Product: <span className="text-dark">{name}</span>
          </h4>
          <Link
            to="/products"
            className="btn btn-sm btn-outline-secondary px-3"
          >
            Back to List
          </Link>
        </Card.Header>

        <Card.Body className="p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Product Name */}
              <Col md={12}>
                <div className="form-group">
                  <label className="fw-bold text-muted small mb-2">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    className={`form-control py-2 ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name[0]}</div>
                  )}
                </div>
              </Col>

              {/* Category, Brand, Status */}
              <Col md={4}>
                <label className="fw-bold text-muted small mb-2">
                  CATEGORY
                </label>
                <select
                  className={`form-select py-2 ${errors.category_id ? "is-invalid" : ""}`}
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
                  <div className="invalid-feedback">
                    {errors.category_id[0]}
                  </div>
                )}
              </Col>

              <Col md={4}>
                <label className="fw-bold text-muted small mb-2">BRAND</label>
                <select
                  className={`form-select py-2 ${errors.brand_id ? "is-invalid" : ""}`}
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
              </Col>

              <Col md={4}>
                <label className="fw-bold text-muted small mb-2">STATUS</label>
                <select
                  className="form-select py-2"
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                >
                  {statuses.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </Col>

              {/* Price & Image */}
              <Col md={6}>
                <label className="fw-bold text-muted small mb-2">
                  BASE PRICE (৳)
                </label>
                <input
                  type="number"
                  className={`form-control py-2 ${errors.base_price ? "is-invalid" : ""}`}
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                {errors.base_price && (
                  <div className="invalid-feedback">{errors.base_price[0]}</div>
                )}
              </Col>

              <Col md={6}>
                <label className="fw-bold text-muted small mb-2">
                  CHANGE PRODUCT IMAGE
                </label>
                <input
                  type="file"
                  className={`form-control py-2 ${errors.image ? "is-invalid" : ""}`}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {errors.image && (
                  <div className="invalid-feedback d-block">
                    {errors.image[0]}
                  </div>
                )}
              </Col>

              {/* Preview & Description */}
              <Col md={12}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <label className="fw-bold text-muted small d-block mb-2">
                      CURRENT IMAGE
                    </label>
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : `${storageUrl}${oldImage}`
                      }
                      alt="Preview"
                      className="img-thumbnail rounded-3"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col md={10}>
                    <label className="fw-bold text-muted small mb-2">
                      DESCRIPTION
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Add product details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-5">
              <Button
                type="submit"
                variant="primary"
                className="px-5 py-2 fw-bold shadow-sm"
                disabled={submitLoading}
              >
                {submitLoading ? "Saving Changes..." : "Update Product"}
              </Button>
              <Button
                variant="light"
                className="px-4 py-2 border shadow-sm"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditProduct;
