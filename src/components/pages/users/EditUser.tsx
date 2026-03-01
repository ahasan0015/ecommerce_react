import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import api from "../../../config";
import type { User } from "../../interfaces/User.interfaces";
import type { Role } from "../../interfaces/role.interface";
import Swal from "sweetalert2";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null); // ইউজারের ডেটা
  const [roles, setRoles] = useState<Role[]>([]); // রোলের লিস্ট
  const [loading, setLoading] = useState(true); // লোডিং চেক

  // পেজ লোড হলে ইউজার ও রোল লোড হবে
  useEffect(() => {
    document.title = "Edit User";
    if (id) {
      fetchUser(id);
      fetchRoles();
    }
  }, [id]);

  // ইউজারের ডেটা API থেকে নেয়া
  const fetchUser = (id: string) => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("User not found");
        navigate(-1); // ভুল হলে ফিরে যাবে
      });
  };

  // রোল লিস্ট লোড করা
  const fetchRoles = () => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data.data))
      .catch((err) => console.error(err));
  };

  // ফর্ম সাবমিট করলে PATCH request
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!user) return;

  //   // শুধুমাত্র name এবং role_id পাঠানো হবে
  //   const formData = {
  //     name: user.name,
  //     role_id: user.role_id,
  //   };

  //   api
  //     .patch(`/users/${id}`, formData)
  //     .then((res) => {
  //       alert(res.data.message); // Success message দেখাবে
  //       navigate("/users"); // আপডেটের পরে Manage Users পেজে যাবে
  //     })
  //     .catch((err) => {
  //       if (err.response?.status === 422) {
  //         console.log("Validation errors:", err.response.data.errors);
  //       } else {
  //         console.error(err);
  //       }
  //     });
  // };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  const formData = {
    name: user.name,
    role_id: user.role_id,
  };

  api
    .patch(`/users/${id}`, formData)
    .then((res) => {
      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/users"); // Update হয়ে গেলে ManageUsers এ যাবে
    })
    .catch((err) => {
      if (err.response?.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: Object.values(err.response.data.errors)
            .flat()
            .join(", "),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong",
        });
      }
    });
};

  if (loading || !user) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-3">Edit User</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={user.role_id}
              onChange={(e) =>
                setUser({ ...user, role_id: parseInt(e.target.value) })
              }
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update User
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditUser;