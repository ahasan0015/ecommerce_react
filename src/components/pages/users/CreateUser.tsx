import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import type { Role } from "../../interfaces/role.interface";

import api from "../../../config";
import { defaultUser, type User } from "../../interfaces/User.interfaces";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [roles, setRole] = useState<Role[]>([]);
  const [user, setUser] = useState<User>(defaultUser);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create User";
    getRoles();
  }, []);

  const getRoles = () => {
    api
      .get("roles")
      .then((res) => {
        console.log(res.data.data);
        setRole(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(user);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    // formData.append("password", user.password);
    // formData.append("password_confirmation", user.password_confirmation);
    formData.append("role_id", user.role_id.toString());
    if (user.phone) formData.append("phone", user.phone);
    api
      .post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data); // Laravel থেকে পাওয়া JSON: status, message, data

        // 👉 SweetAlert success
   // SweetAlert success message
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "Go to Manage Users",
        }).then(() => {
          navigate("/users"); // Redirect on click
        });
      })
      .catch((err: any) => {
        if (err.response?.status === 422) {
          console.log("Validation errors:", err.response.data.errors);
          Swal.fire({
            title: "Validation Error",
            text: "Check console for details",
            icon: "error",
          });
        } else {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Something went wrong!",
            icon: "error",
          });
        }
      });
  }
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("New User Data:", formData);
  //   alert("User Created (static, check console)");
  //   // Reset form
  //   setFormData({ name: "", email: "", phone: "", password: "", role_id: 3, status_id: 1 });
  // };

  return (
    <>
      {/* <h1>hhhhh</h1>
      <form onSubmit={handleSubmit} action="">
        <button>submit</button>
      </form> */}
      <div className="container mt-4">
        <div className="card shadow p-4">
          <h4 className="mb-3">Create New User</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                // placeholder="Enter full name"
                // defaultValue="John Doe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </Form.Group>

            {/* <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              defaultValue="123456"
            />
          </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role_id"
                value={user.role_id}
                onChange={(e) =>
                  setUser({ ...user, role_id: parseInt(e.target.value) })
                }
              >
                {roles.map((role) => (
                  <option value={role.id} key={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Uncomment if you want Status */}
            {/* <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select defaultValue={1}>
              <option value={1}>Active</option>
              <option value={2}>Inactive</option>
              <option value={3}>Banned</option>
            </Form.Select>
          </Form.Group> */}

            <Button type="submit" variant="primary">
              Create User
            </Button>
          </Form>
        </div>
      </div>
    </>
    // <div className="container mt-4">
    //   <div className="card shadow p-4">
    //     <h4 className="mb-3">Create New User</h4>
    //     <Form onSubmit={handleSubmit}>

    //       <Form.Group className="mb-3">
    //         <Form.Label>Name</Form.Label>
    //         <Form.Control
    //           type="text"
    //           value={formData.name}
    //           onChange={e => setFormData({...formData, name: e.target.value})}
    //           placeholder="Enter full name"
    //           required
    //         />
    //       </Form.Group>

    //       <Form.Group className="mb-3">
    //         <Form.Label>Email</Form.Label>
    //         <Form.Control
    //           type="email"
    //           value={formData.email}
    //           onChange={e => setFormData({...formData, email: e.target.value})}
    //           placeholder="Enter email"
    //           required
    //         />
    //       </Form.Group>

    //       <Form.Group className="mb-3">
    //         <Form.Label>Phone</Form.Label>
    //         <Form.Control
    //           type="text"
    //           value={formData.phone}
    //           onChange={e => setFormData({...formData, phone: e.target.value})}
    //           placeholder="Enter phone number"
    //         />
    //       </Form.Group>

    //       <Form.Group className="mb-3">
    //         <Form.Label>Password</Form.Label>
    //         <Form.Control
    //           type="password"
    //           value={formData.password}
    //           onChange={e => setFormData({...formData, password: e.target.value})}
    //           placeholder="Enter password"
    //           required
    //         />
    //       </Form.Group>

    //       <Form.Group className="mb-3">
    //         <Form.Label>Role</Form.Label>
    //         <Form.Select
    //           value={formData.role_id}
    //           onChange={e => setFormData({...formData, role_id: parseInt(e.target.value)})}
    //         >
    //           {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
    //         </Form.Select>
    //       </Form.Group>

    //       {/* <Form.Group className="mb-3">
    //         <Form.Label>Status</Form.Label>
    //         <Form.Select
    //           value={formData.status_id}
    //           onChange={e => setFormData({...formData, status_id: parseInt(e.target.value)})}
    //         >
    //           {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    //         </Form.Select>
    //       </Form.Group> */}

    //       <Button type="submit" variant="primary">Create User</Button>
    //     </Form>
    //   </div>
    // </div>
  );
};

export default CreateUser;
