// import { useNavigate } from "react-router-dom";

// const DetailsUser = () => {
//   const navigate = useNavigate();

//   // Static user (later you can load from API)
//   const user = {
//     id: 1,
//     name: "Admin User",
//     email: "admin@example.com",
//     role: "Admin",
//     status: "Active",
//     phone: "0123456789",
//     created_at: "2026-02-04",
//   };

//   return (
//     <div className="container mt-4">

//       <div className="card shadow">

//         <div className="card-header d-flex justify-content-between">
//           <h5>User Details</h5>

//           <button
//             onClick={() => navigate(-1)}
//             className="btn btn-secondary btn-sm"
//           >
//             Back
//           </button>
//         </div>

//         <div className="card-body">

//           <div className="row mb-3">
//             <div className="col-md-6">
//               <strong>ID:</strong> {user.id}
//             </div>

//             <div className="col-md-6">
//               <strong>Name:</strong> {user.name}
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-6">
//               <strong>Email:</strong> {user.email}
//             </div>

//             <div className="col-md-6">
//               <strong>Phone:</strong> {user.phone}
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-6">
//               <strong>Role:</strong> {user.role}
//             </div>

//             <div className="col-md-6">
//               <strong>Status:</strong>{" "}
//               <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
//                 {user.status}
//               </span>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6">
//               <strong>Created At:</strong> {user.created_at}
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default DetailsUser;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config";

import type { User } from "../../interfaces/User.interfaces";

const DetailsUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL থেকে user id নেয়া
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "User Details";
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = (id: string) => {
    api.get(`/users/${id}`)
      .then(res => {
        console.log(res.data.data);
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        alert("User not found");
        navigate(-1);
      });
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (!user) {
    return null; // অথবা fallback UI
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <div className="card-header d-flex justify-content-between">
          <h5>User Details</h5>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="card-body">

          <div className="row mb-3">
            <div className="col-md-6"><strong>ID:</strong> {user.id}</div>
            <div className="col-md-6"><strong>Name:</strong> {user.name}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6"><strong>Email:</strong> {user.email}</div>
            <div className="col-md-6"><strong>Phone:</strong> {user.phone || "-"}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6"><strong>Role:</strong> {user.role_id}</div>
            <div className="col-md-6">
              <strong>Status:</strong>{" "}
              <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                {user.status || "N/A"}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6"><strong>Created At:</strong> {user.created_at}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailsUser;