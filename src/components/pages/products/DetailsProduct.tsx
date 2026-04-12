import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../config"; 

interface Product {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  category_id: number;
  status_id: number;
  base_price: number | string;
  description: string | null;
  image: string | null;
  category?: { name: string };
  brand?: { name: string };
  status?: { name: string };
}

const DetailsProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Product Details";
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = (productId: string) => {
    setLoading(true);
    api.get(`/products/${productId}`)
      .then((res) => {
        const dataFromApi = res.data.data || res.data;
        setProduct(dataFromApi);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
        alert("Product not found!");
        navigate("/products");
      });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading product information...</p>
      </div>
    );
  }

  // ডাটা না থাকলে আগেই রিটার্ন করে দেওয়া হচ্ছে, তাই এর নিচের কোডগুলোতে TypeScript নিশ্চিত যে product আছে।
  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">No product data found.</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 bg-white p-3 text-center h-100 d-flex align-items-center justify-content-center">
            {product.image ? (
              <img 
                src={`http://localhost:8000/storage/${product.image}`} 
                
                alt={product.name} 
                className="img-fluid rounded"
                style={{ 
                  maxHeight: '500px', 
                  width: '100%', 
                  objectFit: 'contain', 
                  backgroundColor: '#ffffff' 
                }}
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center rounded border w-100" style={{ minHeight: '400px' }}>
                <span className="text-muted italic">No Photo Available</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="ps-md-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small">
                <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
                <li className="breadcrumb-item active text-truncate">{product.name}</li>
              </ol>
            </nav>

            <h1 className="fw-bold text-dark display-6 mb-1">{product.name}</h1>
            <p className="text-muted mb-3">Slug: <span className="text-dark">{product.slug}</span></p>
            
            <div className="d-flex align-items-center gap-3 mb-4">
              <h2 className="text-success fw-bold mb-0">
                {Number(product.base_price).toLocaleString()} <small className="fs-6 text-muted">BDT</small>
              </h2>
              <span className={`badge ${product.status?.name === 'Active' ? 'bg-success' : 'bg-danger'} py-2 px-3`}>
                {product.status?.name || 'Unknown'}
              </span>
            </div>

            <hr className="my-4" />

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 border rounded bg-light text-center">
                  <small className="text-muted d-block fw-bold text-uppercase">Category</small>
                  {/* Optional chaining safely accesses optional interface properties */}
                  <span className="text-primary fw-bold">{product.category?.name ?? "N/A"}</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 border rounded bg-light text-center">
                  <small className="text-muted d-block fw-bold text-uppercase">Brand</small>
                  <span className="text-primary fw-bold">{product.brand?.name ?? "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold border-bottom pb-2">Description</h6>
              <p className="text-secondary lh-lg" style={{ whiteSpace: 'pre-line' }}>
                {product.description || "No description provided for this item."}
              </p>
            </div>

            <div className="mt-5 d-flex gap-2">
              <button 
                onClick={() => navigate(`/products/edit/${product.id}`)}
                className="btn btn-warning px-5 py-2 fw-bold shadow-sm"
              >
                Edit Product
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-outline-dark px-4 py-2"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;