import { useState } from "react";

const CreateProducts = () => {
  const [step, setStep] = useState(1);

  // মক ডাটা (পরবর্তীতে API থেকে আসবে)
  const productStatuses = [
    { id: 1, name: "Published", color: "text-success" },
    { id: 2, name: "Draft", color: "text-warning" },
    { id: 3, name: "Pending", color: "text-info" },
    { id: 4, name: "Inactive", color: "text-danger" },
  ];

  return (
    <div className="container py-5" style={{ maxWidth: "1050px" }}>
      
      {/* 1. Progress Step Indicator */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 d-flex justify-content-center align-items-center gap-5">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="d-flex align-items-center gap-2">
              <div className={`rounded-circle d-flex align-items-center justify-content-center transition-all ${step >= s ? 'bg-primary text-white shadow' : 'bg-light text-muted border'}`} style={{ width: "38px", height: "38px", fontWeight: "bold" }}>
                {s}
              </div>
              <span className={`small fw-bold ${step >= s ? 'text-primary' : 'text-muted'}`}>
                {s === 1 ? "General" : s === 2 ? "Attributes" : s === 3 ? "Variants" : "Media"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Form Container */}
      <div className="card border-0 shadow-sm p-5 bg-white" style={{ minHeight: "550px", borderRadius: "15px" }}>
        
        {/* PAGE 1: Product General Info & Status */}
        {step === 1 && (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0">Product General Info</h4>
              <span className="badge bg-light text-dark border px-3 py-2">Initial Setup</span>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <label className="form-label small fw-bold text-uppercase text-secondary">Product Name</label>
                <input type="text" className="form-control form-control-lg fs-6 border-2" placeholder="e.g. Premium Cotton T-Shirt" />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-uppercase text-secondary">Description</label>
                <textarea className="form-control border-2" rows={4} placeholder="Describe the key features of this product..."></textarea>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold text-uppercase text-secondary">Category</label>
                <select className="form-select border-2">
                  <option>Select Category</option>
                  <option>Men's Fashion</option>
                  <option>Electronics</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold text-uppercase text-secondary">Brand</label>
                <select className="form-select border-2">
                  <option>Select Brand</option>
                  <option>Roxy</option>
                  <option>Nike</option>
                </select>
              </div>

              {/* PRODUCT STATUS INTEGRATION */}
              <div className="col-md-4">
                <label className="form-label small fw-bold text-uppercase text-secondary">Product Status</label>
                <select className="form-select border-2 fw-bold text-primary">
                  {productStatuses.map(status => (
                    <option key={status.id} value={status.id} className={status.color}>
                      {status.name}
                    </option>
                  ))}
                </select>
                <div className="form-text small mt-1">Status determines visibility in the storefront.</div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: Variant Attributes Selection */}
        {step === 2 && (
          <div className="animate__animated animate__fadeIn">
            <h4 className="fw-bold mb-4">Select Attributes</h4>
            <div className="mb-5 bg-light p-4 rounded-3 border border-dashed">
              <h6 className="fw-bold text-muted small text-uppercase mb-3">Colors Swatches</h6>
              <div className="d-flex gap-3 mt-3 flex-wrap">
                {['Blue', 'Black', 'Red', 'Green', 'White', 'Yellow'].map(color => (
                  <button key={color} className="btn btn-outline-primary bg-white border-2 rounded-pill px-4 shadow-sm fw-bold">
                    <span className="me-2" style={{display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color.toLowerCase()}}></span>
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4 bg-light p-4 rounded-3 border border-dashed">
              <h6 className="fw-bold text-muted small text-uppercase mb-3">Sizes Availability</h6>
              <div className="d-flex gap-2 mt-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className="btn btn-white border-2 shadow-sm px-4 fw-bold">{size}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: Variant Grid View */}
        {step === 3 && (
          <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <h4 className="fw-bold m-0">Variants Matrix</h4>
              <button className="btn btn-sm btn-outline-primary fw-bold">Auto-generate SKU</button>
            </div>
            <div className="table-responsive border rounded-3 shadow-sm">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase fw-bold">
                    <th className="py-3">Variant</th><th className="py-3">SKU Code</th><th className="py-3">Price ($)</th><th className="py-3">Stock</th><th className="py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td className="fw-bold text-primary py-3">Blue / XL</td>
                      <td><input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="ROXY-BL-XL" /></td>
                      <td><input type="number" className="form-control form-control-sm border-0 bg-light" placeholder="29.99" /></td>
                      <td><input type="number" className="form-control form-control-sm border-0 bg-light" placeholder="50" /></td>
                      <td className="text-center"><button className="btn btn-link text-danger p-0"><i className="bi bi-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGE 4: Image Management */}
        {step === 4 && (
          <div className="row g-4 animate__animated animate__fadeIn">
            <div className="col-md-8">
              <h4 className="fw-bold mb-4">Upload Gallery</h4>
              <div className="border border-dashed border-2 rounded-4 p-5 text-center bg-light border-primary" style={{backgroundColor: '#f8f9ff !important'}}>
                <i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                <h5 className="mt-3 fw-bold">Drag & Drop Product Images</h5>
                <p className="text-muted small">Max file size: 2MB. Format: JPG, PNG, WEBP</p>
                <button className="btn btn-primary px-5 py-2 fw-bold mt-2 shadow-sm">Browse Media</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-light p-3 shadow-sm" style={{borderRadius: '12px'}}>
                <h6 className="fw-bold small mb-3 text-uppercase text-muted">Active Variant</h6>
                <div className="list-group list-group-flush rounded-3 shadow-sm bg-white overflow-hidden">
                  <button className="list-group-item list-group-item-action active p-3 small fw-bold">Blue / XL</button>
                  <button className="list-group-item list-group-item-action p-3 small fw-bold">Black / M</button>
                </div>
                <div className="alert alert-info mt-3 small py-2 mb-0">
                  <i className="bi bi-info-circle me-2"></i> Select a variant to upload its specific images.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-auto pt-5 d-flex justify-content-between align-items-center">
          <button 
            className={`btn btn-link text-decoration-none fw-bold text-muted ${step === 1 ? 'invisible' : ''}`} 
            onClick={() => setStep(step - 1)}
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Step {step - 1}
          </button>
          
          <button 
            className={`btn ${step === 4 ? 'btn-success' : 'btn-primary'} px-5 py-2 fw-bold shadow-sm`} 
            onClick={() => step < 4 ? setStep(step + 1) : alert("Saving to Database...")}
          >
            {step === 4 ? "Publish Product" : "Save & Continue"} <i className={`bi ${step === 4 ? 'bi-check2-circle' : 'bi-chevron-right'} ms-1`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;