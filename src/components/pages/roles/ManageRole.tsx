import { useState } from "react";

interface Role {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

const ManageRoles = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Admin",
      description: "Full system access",
      status: "Active",
    },
    {
      id: 2,
      name: "Manager",
      description: "Manage products and orders",
      status: "Active",
    },
    {
      id: 3,
      name: "Customer",
      description: "Basic shopping access",
      status: "Inactive",
    },
  ]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this role?")) return;
    setRoles(roles.filter((r) => r.id !== id));
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Roles Management</h5>

          <button className="btn btn-primary">
            + Add Role
          </button>
        </div>

        <div className="card-body">

          <table className="table table-hover table-bordered align-middle">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>{role.description}</td>

                  <td>
                    <span
                      className={`badge ${
                        role.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {role.status}
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
                      onClick={() => handleDelete(role.id)}
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

export default ManageRoles;
