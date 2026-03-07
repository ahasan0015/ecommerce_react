import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from "../../../config";

const CreateCategory: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        status_id: 1
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const generatedSlug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');

            setFormData(prev => ({ ...prev, name: value, slug: generatedSlug }));
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await api.post('/categories', formData);
            if (response.data.success) {
                alert(response.data.message);
                navigate('/categories');
            }
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                alert("Something went wrong!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">

            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                    <h2 className="h3 fw-bold text-dark mb-1">Add New Category</h2>
                </div>

                <NavLink to="/categories" className="btn btn-outline-secondary">
                    Back
                </NavLink>
            </div>

            <div className="row justify-content-center">
                <div className="col-xl-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit}>

                                <div className="row g-4">

                                    {/* Category Name */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                                    </div>

                                    {/* Slug */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Slug</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.slug}
                                            readOnly
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Status</label>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                checked={formData.status_id === 1}
                                                onChange={() => setFormData({ ...formData, status_id: 1 })}
                                            />
                                            <label className="form-check-label">
                                                Active
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                checked={formData.status_id === 2}
                                                onChange={() => setFormData({ ...formData, status_id: 2 })}
                                            />
                                            <label className="form-check-label">
                                                Inactive
                                            </label>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Saving..." : "Create Category"}
                                        </button>
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