const StaticProfilePage = () => {
  // স্ট্যাটিক ইউজার ডেটা
  const user = {
    name: "কাজী আজিজুল হাকিম",
    email: "arzu@example.com",
    phone: "01749174208",
    address: "Sector 7, Uttara, Dhaka",
    joined: "January 2024",
    image: "https://ui-avatars.com/api/?name=Azizul+Hakim&background=0D6EFD&color=fff&size=128"
  };

  // স্ট্যাটিক অর্ডার হিস্ট্রি
  const orders = [
    { id: "#ORD-7741", date: "Jan 28, 2026", item: "Slim Fit Chino", total: 1250, status: "Delivered" },
    { id: "#ORD-8852", date: "Jan 30, 2026", item: "Premium Oxford Shirt", total: 1850, status: "Processing" },
    { id: "#ORD-9963", date: "Jan 31, 2026", item: "Denim Jeans", total: 2100, status: "Pending" },
  ];

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="row g-4">
          
          {/* বাম পাশ: প্রোফাইল কার্ড */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="bg-primary py-5"></div>
              <div className="card-body text-center" style={{ marginTop: "-60px" }}>
                <img
                  src={user.image}
                  alt="Profile"
                  className="rounded-circle border border-4 border-white shadow-sm mb-3"
                  style={{ width: "110px", height: "110px" }}
                />
                <h4 className="fw-bold mb-0">{user.name}</h4>
                <p className="text-muted small mb-3">{user.email}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <button className="btn btn-primary btn-sm px-4 rounded-pill">Edit Profile</button>
                  <button className="btn btn-outline-danger btn-sm px-4 rounded-pill">Logout</button>
                </div>

                <div className="text-start bg-light p-3 rounded-3">
                  <div className="mb-2 small"><strong>Phone:</strong> <span className="text-secondary">{user.phone}</span></div>
                  <div className="mb-2 small"><strong>Address:</strong> <span className="text-secondary">{user.address}</span></div>
                  <div className="small"><strong>Member Since:</strong> <span className="text-secondary">{user.joined}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ডান পাশ: ড্যাশবোর্ড এবং অর্ডার */}
          <div className="col-lg-8">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 rounded-4 text-center">
                  <h2 className="fw-bold text-primary mb-0">{orders.length}</h2>
                  <small className="text-muted text-uppercase fw-bold">Total Orders</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 rounded-4 text-center">
                  <h2 className="fw-bold text-warning mb-0">1</h2>
                  <small className="text-muted text-uppercase fw-bold">In Progress</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 rounded-4 text-center">
                  <h2 className="fw-bold text-success mb-0">৳5,200</h2>
                  <small className="text-muted text-uppercase fw-bold">Total Spent</small>
                </div>
              </div>
            </div>

            {/* রিসেন্ট অর্ডার টেবিল */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4">Recent Orders</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">Order ID</th>
                      <th className="border-0">Product</th>
                      <th className="border-0">Total</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold text-secondary">{order.id}</td>
                        <td>{order.item}</td>
                        <td>৳{order.total}</td>
                        <td>
                          <span className={`badge rounded-pill ${
                            order.status === 'Delivered' ? 'bg-success-subtle text-success' : 
                            order.status === 'Processing' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'
                          } px-3`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-light border rounded-pill px-3">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaticProfilePage;