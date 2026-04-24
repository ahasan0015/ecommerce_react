import React, { useEffect, useState } from "react";
import api from "../../../config";

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

const ManageColors = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [name, setName] = useState<string>("");
  const [hexCode, setHexCode] = useState<string>("#000000");
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  
  const fetchColors = () => {
    setLoading(true);
    api.get("/colors")
      .then((res) => setColors(res.data.data || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchColors();
  }, []);

 
  const handleEdit = (color: Color) => {
    setEditingId(color.id);
    setName(color.name);
    setHexCode(color.hex_code);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setHexCode("#000000");
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = { name, hex_code: hexCode };

    if (editingId) {
      api.put(`/colors/${editingId}`, payload)
        .then(() => {
          cancelEdit();
          fetchColors();
        })
        .catch(() => alert("Update failed"));
    } else {
      api.post("/colors", payload)
        .then(() => {
          setName("");
          setHexCode("#000000");
          fetchColors();
        });
    }
  };

  // ৪. ডিলিট হ্যান্ডলার
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure?")) {
      api.delete(`/colors/${id}`).then(() => fetchColors());
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* From Section*/}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "20px" }}>
            <h5 className="fw-bold mb-3">
              {editingId ? "Update Color" : "Add New Color"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="small fw-bold mb-1">Color Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navy Blue"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="small fw-bold mb-1">Pick Color / Hex Code</label>
                <div className="d-flex gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    title="Choose your color"
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={hexCode}
                    onChange={(e) => setHexCode(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className={`btn w-100 fw-bold ${editingId ? 'btn-warning' : 'btn-primary'}`}>
                  {editingId ? "Update Color" : "Save Color"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section*/}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Color Name</th>
                    <th>Preview</th>
                    <th>Hex Code</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                        Loading Colors...
                      </td>
                    </tr>
                  ) : colors.length > 0 ? (
                    colors.map((color, index) => (
                      <tr key={color.id} className={editingId === color.id ? "table-warning" : ""}>
                        <td className="ps-3">{index + 1}</td>
                        <td className="fw-bold">{color.name}</td>
                        <td>
                          <div 
                            style={{ 
                              width: "40px", 
                              height: "20px", 
                              backgroundColor: color.hex_code, 
                              borderRadius: "4px",
                              border: "1px solid #ddd" 
                            }}
                          ></div>
                        </td>
                        <td><code>{color.hex_code}</code></td>
                        <td className="text-end pe-3">
                          <button className="btn btn-sm btn-info text-white me-2" onClick={() => handleEdit(color)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(color.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">No colors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageColors;