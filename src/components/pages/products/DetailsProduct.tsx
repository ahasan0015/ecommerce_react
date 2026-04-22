import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../config";
import {
  Spinner,
  Badge,
  Button,
  Card,
  Row,
  Col,
  Table,
  Carousel,
} from "react-bootstrap";
import Swal from "sweetalert2";

// 1. Interfaces for Type Safety
interface GalleryImage {
  image: string;
  is_main: number;
}

interface Variant {
  id: number;
  sku: string;
  sale_price: number;
  stock: number;
  color_name: string | null;
  size_name: string | null;
}

interface ProductDetails {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  main_image: string | null;
  category_name: string;
  brand_name: string;
  status_name: string;
  gallery: GalleryImage[];
  variants: Variant[];
}

const DetailsProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const storageUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    fetchProduct();
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      } else {
        Swal.fire("Error", "Product not found!", "error");
        navigate("/products");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Failed to load product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-white"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 fw-bold text-muted">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="container mt-5 alert alert-danger">No Product Found!</div>
    );

  return (
    <div className="container-fluid py-3 py-md-5 bg-light min-vh-100">
      <div className="container">
        {/* Header & Navigation */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">{product.name}</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small">
                <li className="breadcrumb-item">
                  <Link to="/products" className="text-decoration-none">
                    Products
                  </Link>
                </li>
                <li className="breadcrumb-item active">{product.name}</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex gap-2 w-100 w-md-auto">
            <Button
              variant="outline-secondary"
              className="flex-grow-1 flex-md-grow-0"
              onClick={() => navigate("/products")}
            >
              Back
            </Button>
            <Button
              variant="primary"
              className="flex-grow-1 flex-md-grow-0"
              onClick={() => navigate(`/products/edit/${product.id}`)}
            >
              Edit
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Left Column: Image Carousel */}
          <Col lg={6}>
            <Card
              className="border-0 shadow-sm rounded-4 overflow-hidden sticky-lg-top"
              style={{ top: "20px" }}
            >
              <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                interval={null}
                variant="dark"
                className="bg-white"
              >
                {/* Main Image Slide */}
                <Carousel.Item>
                  <div
                    className="d-flex align-items-center justify-content-center p-2"
                    style={{ height: "400px" }}
                  >
                    <img
                      src={
                        product.main_image
                          ? `${storageUrl}${product.main_image}`
                          : "https://via.placeholder.com/500x400?text=No+Image"
                      }
                      className="img-fluid"
                      alt="main"
                      style={{ maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                </Carousel.Item>

                {/* Gallery Images Slide */}
                {product.gallery?.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div
                      className="d-flex align-items-center justify-content-center p-2"
                      style={{ height: "400px" }}
                    >
                      <img
                        src={`${storageUrl}${img.image}`}
                        className="img-fluid"
                        alt={`gallery-${idx}`}
                        style={{ maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>

              {/* Thumbnails */}
              <Card.Body className="bg-light border-top p-3">
                <div className="d-flex gap-2 overflow-auto justify-content-start flex-nowrap pb-2">
                  <img
                    src={`${storageUrl}${product.main_image}`}
                    className={`img-thumbnail rounded-3 flex-shrink-0 ${activeIndex === 0 ? "border-primary border-2" : ""}`}
                    style={{
                      width: "65px",
                      height: "65px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveIndex(0)}
                    alt="thumb-main"
                  />
                  {product.gallery?.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${storageUrl}${img.image}`}
                      className={`img-thumbnail rounded-3 flex-shrink-0 ${activeIndex === idx + 1 ? "border-primary border-2" : ""}`}
                      style={{
                        width: "65px",
                        height: "65px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => setActiveIndex(idx + 1)}
                      alt={`thumb-${idx}`}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Information & Variants */}
          <Col lg={6}>
            <div className="d-flex flex-column gap-4">
              {/* Pricing & Badges */}
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <div className="mb-3 d-flex flex-wrap gap-2">
                  <Badge
                    bg="primary-subtle"
                    className="text-primary px-3 py-2 border border-primary-subtle"
                  >
                    {product.category_name}
                  </Badge>
                  <Badge
                    bg="info-subtle"
                    className="text-info px-3 py-2 border border-info-subtle"
                  >
                    {product.brand_name}
                  </Badge>
                  <Badge
                    bg={
                      product.status_name === "Active" ? "success" : "warning"
                    }
                    className="px-3 py-2"
                  >
                    {product.status_name}
                  </Badge>
                </div>

                <h1 className="fw-bold text-primary mb-3">
                  ৳ {product.base_price.toLocaleString()}
                </h1>
                <hr />
                <h6 className="fw-bold text-muted text-uppercase mb-3">
                  Product Description
                </h6>
                <div
                  className="text-secondary small lh-lg"
                  dangerouslySetInnerHTML={{
                    __html: product.description || "No description available.",
                  }}
                />
              </Card>

              {/* Variants Table */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 border-0">
                  <h6 className="mb-0 fw-bold">Stock & Variants</h6>
                </div>
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr className="small text-uppercase">
                        <th className="ps-4">SKU</th>
                        <th>Attributes</th>
                        <th className="text-end">Price</th>
                        <th className="text-center pe-4">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants?.length > 0 ? (
                        product.variants.map((v) => (
                          <tr key={v.id}>
                            <td className="ps-4 py-3 fw-bold text-primary small">
                              {v.sku}
                            </td>
                            <td className="small">
                              <span className="text-dark">
                                {v.color_name || "N/A"}
                              </span>
                              <span className="text-muted mx-1">/</span>
                              <span className="text-dark">
                                {v.size_name || "N/A"}
                              </span>
                            </td>
                            <td className="text-end fw-bold">
                              ৳{v.sale_price.toLocaleString()}
                            </td>
                            <td className="text-center pe-4">
                              <Badge
                                pill
                                bg={
                                  v.stock > 10
                                    ? "success"
                                    : v.stock > 0
                                      ? "warning"
                                      : "danger"
                                }
                              >
                                {v.stock} pcs
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-4 text-muted"
                          >
                            No variants available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailsProduct;
