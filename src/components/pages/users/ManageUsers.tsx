import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "Customer",
      status: "Inactive",
    },
  ]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Users Management</h5>

          <button className="btn btn-primary">
            + Add User
          </button>
        </div>

        <div className="card-body">

          <table className="table table-hover table-bordered align-middle">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="text-center">

                    <button className="btn btn-secondary btn-sm me-2">
                      View
                    </button>

                    <button className="btn btn-warning btn-sm me-2">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
