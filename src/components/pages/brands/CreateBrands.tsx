import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../config";

// ইন্টারফেস ডিফাইন করা
interface Status {
  id: number;
  name: string;
}

const CreateBrand = () => {
  const [name, setName] = useState<string>("");
  const [statusId, setStatusId] = useState<number>(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create Brand";
    getStatuses();
  }, []);

  const getStatuses = () => {
    api
      .get("/product-statuses")
      .then((res) => {
        setStatuses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching statuses:", err);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status_id", statusId.toString());
    if (logo) {
      formData.append("logo", logo);
    }

    api
      .post("/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        alert(res.data.message || "Brand created successfully!");
        navigate("/brands"); // সফল হলে লিস্ট পেজে নিয়ে যাবে
      })
      .catch((err: any) => {
        if (err.response?.status === 422) {
          console.log("Validation errors:", err.response.data.errors);
          alert("Validation Error: Please check the console or inputs.");
        } else {
          console.error(err);
          alert("Something went wrong!");
        }
      });
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-3">Create New Brand</h4>
        <Form onSubmit={handleSubmit}>
          {/* Brand Name */}
          <Form.Group className="mb-3">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Status Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusId}
              onChange={(e) => setStatusId(parseInt(e.target.value))}
              required
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option value={status.id} key={status.id}>
                  {status.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Logo Upload */}
          <Form.Group className="mb-4">
            <Form.Label>Brand Logo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Form.Text className="text-muted">
              Upload a JPG, PNG or WEBP image.
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">
              Create Brand
            </Button>
            <Button variant="secondary" onClick={() => navigate("/brands")}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateBrand;