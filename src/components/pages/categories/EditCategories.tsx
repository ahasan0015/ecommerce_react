import React from 'react';
import { NavLink } from 'react-router-dom';

const EditCategory = () => {
  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h2 className="h3 fw-bold text-dark mb-1">Edit Category</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><NavLink to="/" className="text-decoration-none">Dashboard</NavLink></li>
              <li className="breadcrumb-item"><NavLink to="/categories" className="text-decoration-none">Categories</NavLink></li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
        <NavLink to="/categories" className="btn btn-white border shadow-sm px-4 fw-semibold">
          <i className="bi bi-arrow-left me-2"></i> Back to List
        </NavLink>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-9">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-5">
              <form>
                <div className="row g-4">
                  {/* Category Name (Pre-filled Static) */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark">Category Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg border-2 shadow-none" 
                      defaultValue="Formal Shirts" 
                      maxLength={100}
                    />
                    <div className="form-text text-muted">Edit the category name.</div>
                  </div>

                  {/* Slug (Read-only Static) */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark">Slug (SEO URL)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-2 text-muted">/category/</span>
                      <input 
                        type="text" 
                        className="form-control form-control-lg border-2 bg-light shadow-none" 
                        defaultValue="formal-shirts" 
                        readOnly 
                      />
                    </div>
                  </div>

                  {/* Brand Association (Static Selection) */}
                  <div className="col-md-6 mt-4">
                    <label className="form-label fw-bold text-dark">Select Brand</label>
                    <select className="form-select form-select-lg border-2 shadow-none" defaultValue="2">
                      <option value="">-- Choose Brand --</option>
                      <option value="1">Nike</option>
                      <option value="2">Adidas</option>
                      <option value="3">Levis</option>
                    </select>
                  </div>

                  {/* Status Selection (Static Active) */}
                  <div className="col-md-6 mt-4">
                    <label className="form-label fw-bold text-dark d-block mb-3">Category Status</label>
                    <div className="btn-group w-100" role="group">
                      <input type="radio" className="btn-check" name="status" id="active" defaultChecked />
                      <label className="btn btn-outline-success py-2 fw-bold" htmlFor="active">Active</label>

                      <input type="radio" className="btn-check" name="status" id="inactive" />
                      <label className="btn btn-outline-danger py-2 fw-bold" htmlFor="inactive">Inactive</label>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="col-12 mt-5 border-top pt-4">
                    <div className="d-flex justify-content-end align-items-center">
                      <NavLink 
                        to="/categories" 
                        className="btn btn-light btn-lg px-4 me-3 border fw-semibold"
                      >
                        Cancel
                      </NavLink>
                      <button type="button" className="btn btn-primary btn-lg px-5 fw-bold shadow">
                        Update Category
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Static Info Box */}
          <div className="mt-4 p-3 bg-white border-start border-primary border-4 rounded shadow-sm">
            <p className="mb-0 small text-muted">
              <strong>Note:</strong> Updating the category name will automatically refresh the SEO slug. 
              Make sure to check if this impacts any live links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;