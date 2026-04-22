import { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../../config";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

/**
 * Interfaces for Type Safety
 */
interface Status {
  id: number;
  name: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

interface ApiErrorResponse {
  message?: string;
  errors?: ValidationErrors;
}

const CreateBrand = () => {
  const [name, setName] = useState<string>("");
  const [statusId, setStatusId] = useState<number | string>("");
  const [logo, setLogo] = useState<File | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingStatuses, setFetchingStatuses] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create Brand";
    getStatuses();
  }, []);

  const getStatuses = () => {
    setFetchingStatuses(true);
    api
      .get("/product-statuses")
      .then((res) => {
        // লজিক: ডাটা অ্যারে কিনা চেক করা, না হলে .data কি চেক করা
        const responseData = res.data;
        const data: Status[] = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];
        setStatuses(data);
      })
      .catch((err: Error | AxiosError) => {
        console.error("Error fetching statuses:", err.message);
        setStatuses([]);
      })
      .finally(() => setFetchingStatuses(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status_id", statusId.toString());
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const res = await api.post("/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message || "Brand created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/brands");
    } catch (err: unknown) {
      // AxiosError টাইপ গার্ড ব্যবহার করে 'any' রিমুভ করা হয়েছে
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ApiErrorResponse>;

        if (serverError.response?.status === 422) {
          // লারাভেল ভ্যালিডেশন এরর অবজেক্ট সেট করা
          // অনেক সময় লারাভেল সরাসরি ডাটা অবজেক্টে এরর পাঠায়, তাই কাস্টিং করা হয়েছে
          const errors = serverError.response.data as ValidationErrors;
          setValidationErrors(errors);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              serverError.response?.data?.message ||
              "Something went wrong! Please try again.",
          });
        }
      } else {
        console.error("Non-Axios Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold">Create New Brand</h4>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/brands")}
          >
            Back to List
          </Button>
        </div>

        {/* ভ্যালিডেশন এরর মেসেজ বক্স */}
        {validationErrors && (
          <Alert variant="danger" className="py-2">
            <ul className="mb-0 small">
              {Object.entries(validationErrors).map(([key, messages]) => (
                <li key={key}>
                  <strong>{key.replace("_", " ")}:</strong> {messages[0]}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Brand Name */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Brand Name</Form.Label>
            <Form.Control
              type="text"
              className={validationErrors?.name ? "is-invalid" : ""}
              placeholder="e.g. Nike, Adidas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {validationErrors?.name && (
              <div className="invalid-feedback">{validationErrors.name[0]}</div>
            )}
          </Form.Group>

          {/* Status Selection */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Status</Form.Label>
            <Form.Select
              value={statusId}
              className={validationErrors?.status_id ? "is-invalid" : ""}
              onChange={(e) => setStatusId(e.target.value)}
              required
              disabled={fetchingStatuses}
            >
              <option value="">
                {fetchingStatuses ? "Loading statuses..." : "Select Status"}
              </option>
              {statuses.map((status) => (
                <option value={status.id} key={status.id}>
                  {status.name}
                </option>
              ))}
            </Form.Select>
            {validationErrors?.status_id && (
              <div className="invalid-feedback">
                {validationErrors.status_id[0]}
              </div>
            )}
          </Form.Group>

          {/* Logo Upload */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Brand Logo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={validationErrors?.logo ? "is-invalid" : ""}
            />
            <Form.Text className="text-muted">
              Recommended: 200x200px (Max 2MB).
            </Form.Text>
            {validationErrors?.logo && (
              <div className="invalid-feedback d-block">
                {validationErrors.logo[0]}
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2 border-top pt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                "Create Brand"
              )}
            </Button>
            <Button
              variant="light"
              onClick={() => navigate("/brands")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateBrand;
