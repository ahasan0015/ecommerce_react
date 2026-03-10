import React, { useEffect, useState } from "react";
import api from "../../../config";

interface Size {
  id: number;
  name: string;
}

const SizeManage = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // এডিট মোড ট্র্যাক করার জন্য স্টেট
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSizes = () => {
    setLoading(true);
    api
      .get("/sizes")
      .then((res) => setSizes(res.data.data || res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  // এডিট বাটনে ক্লিক করলে যা হবে
  const handleEdit = (size: Size) => {
    setEditingId(size.id); // আইডি স্টোর করা
    setName(size.name); // ইনপুটে পুরনো নাম সেট করা
  };

  // ক্যান্সেল এডিট
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      // ১. আপডেট লজিক (PUT/PATCH Request)
      api
        .put(`/sizes/${editingId}`, { name })
        .then(() => {
          cancelEdit();
          fetchSizes();
        })
        .catch((err) => alert("Update failed!"));
    } else {
      // ২. নতুন সেভ লজিক
      api.post("/sizes", { name }).then(() => {
        setName("");
        fetchSizes();
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure?")) {
      api.delete(`/sizes/${id}`).then(() => fetchSizes());
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* ফর্ম সেকশন */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h5 className="fw-bold mb-3">
              {editingId ? "Update Size" : "Add New Size"}
            </h5>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. XL, 38"
                required
              />
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn w-100 ${editingId ? "btn-warning" : "btn-primary"}`}
                >
                  {editingId ? "Update" : "Save"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* লিস্ট সেকশন */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Size Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // যখন ডাটা লোড হচ্ছে তখন এটি দেখাবে
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading sizes...
                    </td>
                  </tr>
                ) : sizes.length > 0 ? (
                  // ডাটা চলে আসলে লিস্ট দেখাবে
                  sizes.map((size, index) => (
                    <tr
                      key={size.id}
                      className={editingId === size.id ? "table-warning" : ""}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <span className="badge bg-dark px-3">{size.name}</span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-info text-white me-2"
                          onClick={() => handleEdit(size)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(size.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // যদি কোনো ডাটা না থাকে
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-muted">
                      No sizes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeManage;
