import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const BulkVariantForm = () => {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    
    // Form States
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [basePrice, setBasePrice] = useState('');

    // ১. ব্যাকএন্ড থেকে ডাটা লোড করা
    useEffect(() => {
        const fetchData = async () => {
            const resProd = await axios.get('/api/products');
            const resCol = await axios.get('/api/colors');
            const resSize = await axios.get('/api/sizes');

            // Select-এর ফরম্যাটে ডাটা সাজানো
            setProducts(resProd.data.map(p => ({ value: p.id, label: p.name })));
            setColors(resCol.data.map(c => ({ value: c.id, label: c.name })));
            setSizes(resSize.data.map(s => ({ value: s.id, label: s.name })));
        };
        fetchData();
    }, []);

    // ২. সাবমিট হ্যান্ডলার
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            product_id: selectedProduct.value,
            color_ids: selectedColors.map(c => c.value), // [1, 2, 3]
            size_ids: selectedSizes.map(s => s.value),   // [1, 2]
            base_price: basePrice,
            status_id: 1 // Active
        };

        try {
            const res = await axios.post('/api/variants/bulk-store', data);
            alert(res.data.message);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 border rounded">
            <label>Product Select</label>
            <Select options={products} onChange={setSelectedProduct} />

            <label className="mt-3 block">Colors (Multi)</label>
            <Select isMulti options={colors} onChange={setSelectedColors} />

            <label className="mt-3 block">Sizes (Multi)</label>
            <Select isMulti options={sizes} onChange={setSelectedSizes} />

            <label className="mt-3 block">Base Price</label>
            <input 
                type="number" 
                className="form-control" 
                value={basePrice} 
                onChange={(e) => setBasePrice(e.target.value)} 
            />

            <button type="submit" className="btn btn-primary mt-4">Generate Variants</button>
        </form>
    );
};

export default BulkVariantForm;