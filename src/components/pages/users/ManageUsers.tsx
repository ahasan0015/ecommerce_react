import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import api from "../../../config";

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
  const [lastPage, setLastPage] = useState(1);

  const fetchUsers = (page = 1) => {
    api.get(`/users?page=${page}`).then(res => {
      setUsers(res.data.data.data);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePageClick = (data: { selected: number }) => {
    fetchUsers(data.selected + 1);
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            <th>S.L</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{(currentPage - 1) * 10 + index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={lastPage}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-end"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </nav>
    </div>
  );
};

export default ManageUsers;