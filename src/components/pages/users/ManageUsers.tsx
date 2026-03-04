import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../../config";
import Swal from "sweetalert2";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (page: number = 1) => {
    api.get(`/users?page=${page}`)
      .then(res => {
        setUsers(res.data.data.data); // Laravel paginate returns {data: [...], current_page, last_page, etc.}
        setCurrentPage(res.data.data.current_page);
        setTotalPages(res.data.data.last_page);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    document.title = "Manage Users";
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/users/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "User has been deleted.", "success");
            fetchUsers(currentPage); // reload current page
          })
          .catch(() => Swal.fire("Error!", "Something went wrong", "error"));
      }
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Users Management</h5>
          <NavLink to='/users/create' className="btn btn-primary">+ Add User</NavLink>
        </div>
        <div className="card-body">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>S.L</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="text-center">
                    <NavLink to={`/users/${user.id}`} className="btn btn-secondary btn-sm me-2">View</NavLink>
                    <NavLink to={`/users/edit/${user.id}`} className="btn btn-warning btn-sm me-2">Edit</NavLink>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  );
};

export default ManageUsers;