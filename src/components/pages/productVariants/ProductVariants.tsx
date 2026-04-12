import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config";

const ProductVariants = () => {
    const { id } = useParams();
    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states for Bulk Generation
    const [colors, setColors] = useState<any[]>([]);
    const [sizes, setSizes] = useState<any[]>([]);
    const [selectedColors, setSelectedColors] = useState<number[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
    const [basePrice, setBasePrice] = useState<number>(0);

    useEffect(() => {
        if (id) {
            fetchVariants();
            fetchMetadata();
        }
    }, [id]);

    const fetchMetadata = async () => {
        try {
            const [colorRes, sizeRes] = await Promise.all([
                api.get('/colors'),
                api.get('/sizes')
            ]);
            setColors(colorRes.data.data || []);
            setSizes(sizeRes.data.data || []);
        } catch (err) {
            console.error("Metadata fetch error:", err);
        }
    };

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/variants/product/${id}`);
            setVariants(res.data.data || []);
        } catch (err) {
            console.error("Error fetching variants:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedColors.length === 0 || selectedSizes.length === 0) {
            alert("Please select at least one color and one size.");
            return;
        }

        try {
            await api.post('/variants/bulk-store', {
                product_id: id,
                color_ids: selectedColors,
                size_ids: selectedSizes,
                base_price: basePrice,
                status_id: 1 // Default Active
            });
            alert("Variants Generated!");
            fetchVariants(); // Refresh table
        } catch (err) {
            alert("Failed to generate variants.");
        }
    };

    const handleUpdateStock = async (variantId: number, newStock: string) => {
        try {
            await api.patch(`/variants/${variantId}/update-stock`, { stock: newStock });
            setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock: newStock } : v));
        } catch (err) {
            alert("Update failed!");
        }
    };

    const handleDelete = async (variantId: number) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/variants/${variantId}`);
                setVariants(prev => prev.filter(v => v.id !== variantId));
            } catch (err) {
                alert("Delete failed!");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="fw-bold mb-4 text-uppercase">Manage Inventory (Product ID: {id})</h4>

            {/* Part 1: Bulk Generator Form */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Bulk Variant Generator</h6>
                    <form onSubmit={handleBulkGenerate}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Select Colors</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {colors.map(c => (
                                        <div key={c.id}>
                                            <input 
                                                type="checkbox" className="btn-check" id={`btn-c-${c.id}`} 
                                                onChange={(e) => e.target.checked ? setSelectedColors([...selectedColors, c.id]) : setSelectedColors(selectedColors.filter(i => i !== c.id))}
                                            />
                                            <label className="btn btn-sm btn-outline-secondary" htmlFor={`btn-c-${c.id}`}>{c.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Select Sizes</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {sizes.map(s => (
                                        <div key={s.id}>
                                            <input 
                                                type="checkbox" className="btn-check" id={`btn-s-${s.id}`} 
                                                onChange={(e) => e.target.checked ? setSelectedSizes([...selectedSizes, s.id]) : setSelectedSizes(selectedSizes.filter(i => i !== s.id))}
                                            />
                                            <label className="btn btn-sm btn-outline-secondary" htmlFor={`btn-s-${s.id}`}>{s.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-bold">Sale Price</label>
                                <input type="number" className="form-control form-control-sm" onChange={(e) => setBasePrice(Number(e.target.value))} required />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-sm btn-primary w-100">Generate</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Part 2: Variants Table */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Current Stock & Variants</h6>
                    <span className="badge bg-primary">{variants.length} Variants</span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">SKU</th>
                                <th>Color / Size</th>
                                <th>Price</th>
                                <th style={{ width: '120px' }}>Stock</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                            ) : variants.length > 0 ? (
                                variants.map((v) => (
                                    <tr key={v.id}>
                                        <td className="ps-4"><code className="fw-bold">{v.sku}</code></td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div style={{ backgroundColor: v.color?.hex_code, width: '12px', height: '12px', borderRadius: '50%', marginRight: '8px', border: '1px solid #ddd' }}></div>
                                                {v.color?.name} / {v.size?.name}
                                            </div>
                                        </td>
                                        <td>{v.sale_price} BDT</td>
                                        <td>
                                            <input type="number" className="form-control form-control-sm text-center" defaultValue={v.stock} onBlur={(e) => handleUpdateStock(v.id, e.target.value)} />
                                        </td>
                                        <td><span className={`badge rounded-pill ${v.status?.name === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{v.status?.name || 'Active'}</span></td>
                                        <td className="text-end pe-4">
                                            <button onClick={() => handleDelete(v.id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash"></i></button>
                                        </td>
                                        <td>
                                            <button type="submit" className="btn btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="text-center py-5">No data found. Use the generator above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductVariants;