import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from "../../../config"; // আপনার Axios কনফিগ

const CreateCategory: React.FC = () => {
    const navigate = useNavigate();

    // ১. ডাটা স্টেট
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        brand_id: '',
        status_id: 1 // Default Active
    });

    // ২. অন্যান্য স্টেট
    const [brands, setBrands] = useState<{ id: number, name: string }[]>([]);
    const [errors, setErrors] = useState<any>({}); // সার্ভার সাইড এরর স্টোর করার জন্য
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ৩. ব্র্যান্ড লিস্ট লোড করা
    useEffect(() => {
        api.get('/brands')
            .then(res => {
                if (res.data.success) setBrands(res.data.data);
            })
            .catch(err => console.error("Error loading brands:", err));
    }, []);

    // ৪. ইনপুট হ্যান্ডলার + অটো স্লাগ জেনারেশন
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            // প্রফেশনাল স্লাগ জেনারেশন লজিক
            const generatedSlug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w ]+/g, '') // স্পেশাল ক্যারেক্টার রিমুভ
                .replace(/ +/g, '-');    // স্পেসকে ড্যাশ দিয়ে রিপ্লেস

            setFormData(prev => ({ ...prev, name: value, slug: generatedSlug }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // ইউজার টাইপ করা শুরু করলে ওই ফিল্ডের এরর মেসেজ হাইড করা
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // ৫. ফর্ম সাবমিট লজিক
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await api.post('/categories', formData);
            if (response.data.success) {
                alert(response.data.message);
                navigate('/categories'); // সাকসেস হলে লিস্ট পেজে ফেরত যাওয়া
            }
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                // লারাভেল ভ্যালিডেশন এররগুলো স্টেটে সেট করা
                setErrors(err.response.data.errors);
            } else {
                alert("Something went wrong! Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                    <h2 className="h3 fw-bold text-dark mb-1">Add New Category</h2>
                    <p className="text-muted small mb-0">Fill in the fields to create a unique product category.</p>
                </div>
                <NavLink to="/categories" className="btn btn-outline-secondary px-4 shadow-sm fw-semibold">
                    <i className="bi bi-arrow-left me-2"></i> Back to List
                </NavLink>
            </div>

            <div className="row justify-content-center">
                <div className="col-xl-9">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    
                                    {/* Category Name Field */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Category Name <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            className={`form-control form-control-lg border-2 shadow-none ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Premium T-Shirts"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <div className="invalid-feedback fw-bold">{errors.name[0]}</div>}
                                    </div>

                                    {/* Slug Field (Read Only) */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Slug (SEO URL)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-2 text-muted">/</span>
                                            <input 
                                                type="text" 
                                                className={`form-control form-control-lg border-2 bg-light shadow-none ${errors.slug ? 'is-invalid' : ''}`}
                                                value={formData.slug}
                                                readOnly 
                                            />
                                            {errors.slug && <div className="invalid-feedback fw-bold">{errors.slug[0]}</div>}
                                        </div>
                                    </div>

                                    {/* Brand Association */}
                                    <div className="col-md-6 mt-4">
                                        <label className="form-label fw-bold">Associate Brand</label>
                                        <select 
                                            name="brand_id"
                                            className={`form-select form-select-lg border-2 shadow-none ${errors.brand_id ? 'is-invalid' : ''}`}
                                            value={formData.brand_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- No Specific Brand --</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                                            ))}
                                        </select>
                                        {errors.brand_id && <div className="invalid-feedback fw-bold">{errors.brand_id[0]}</div>}
                                    </div>

                                    {/* Status Selection (Radio Buttons) */}
                                    <div className="col-md-6 mt-4">
                                        <label className="form-label fw-bold d-block mb-3">Display Status</label>
                                        <div className="btn-group w-100" role="group">
                                            <input 
                                                type="radio" className="btn-check" name="status_id" id="active" 
                                                checked={Number(formData.status_id) === 1}
                                                onChange={() => setFormData({...formData, status_id: 1})}
                                            />
                                            <label className="btn btn-outline-success py-2 fw-bold" htmlFor="active">Active</label>

                                            <input 
                                                type="radio" className="btn-check" name="status_id" id="inactive" 
                                                checked={Number(formData.status_id) === 2}
                                                onChange={() => setFormData({...formData, status_id: 2})}
                                            />
                                            <label className="btn btn-outline-danger py-2 fw-bold" htmlFor="inactive">Inactive</label>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="col-12 mt-5 border-top pt-4">
                                        <div className="d-flex justify-content-end align-items-center">
                                            <button 
                                                type="button" 
                                                onClick={() => navigate('/categories')}
                                                className="btn btn-light btn-lg px-4 me-3 border fw-semibold"
                                            >
                                                Discard
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="btn btn-primary btn-lg px-5 fw-bold shadow-sm"
                                            >
                                                {isSubmitting ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                                ) : 'Create Category'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;