import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../../config";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string; // API থেকে আসা phone
  role: string;  // API থেকে আসা role
}

const ManageUsers = () => {
 // ৪. শুরুতে ইউজারের লিস্ট খালি [] থাকবে
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = () => {
  api.get("users")
    .then((res) => {
      // console.log(res.data.data);
      setUsers(res.data.data);
    })
    .catch((err) => {
      console.error(err);
    })
  }
  // ৬. পেজটি ওপেন হওয়ার সাথে সাথে ডাটা লোড হবে
  useEffect(() => {
    document.title = "Manage Users";
    getUsers();
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Users Management</h5>

          <NavLink to='/users/create' className="btn btn-primary">
            + Add User
          </NavLink>
        </div>

        <div className="card-body">

          <table className="table table-hover table-bordered align-middle">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th>Status</th> */}
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

                  {/* <td>
                    <span
                      className={`badge ${
                        user.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td> */}

                  <td className="text-center">

                    <NavLink to='/users/details' className="btn btn-secondary btn-sm me-2">
                      View
                    </NavLink>

                    <NavLink to='/edit/user' className="btn btn-warning btn-sm me-2">
                      Edit
                    </NavLink>

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
            <tfoot>
              
            </tfoot>

          </table>

        </div>

      </div>
    </div>
  );
};

export default ManageUsers;
