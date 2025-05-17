import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminDashboard.css"; // Import custom CSS
import Footer from "../Components/Footer";  // ✅ Import Footer

const AdminDashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null); // State to hold admin details
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  // Fetch admin details from the /dashboard endpoint
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/auth/dashboard", {
          withCredentials: true, // Ensures session cookies are sent with the request
        });
        setAdminDetails(response.data); // Set admin details in state
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // If unauthorized, redirect to login
          navigate("/admin-login");
        } else {
          setError("Error fetching admin details. Please try again later.");
        }
      }
    };

    fetchAdminDetails();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/admin/auth/logout", {}, {
        withCredentials: true, // Send session cookies to invalidate the session
      });
      navigate("/admin-login"); // Redirect to admin login on successful logout
    } catch (err) {
      setError("Error logging out. Please try again.");
    }
  };

  // Render Navbar
  const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow small-navbar"> {/* Added custom class */}
     <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        {/* Bank Logo */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <i className="bi bi-bank fs-2 text-primary me-2"></i>
          <span className="fs-4 fw-bold">Dixit Bank</span>
        </a>

        {/* Navbar Menus */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="/adminview">View Customers</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/adviewTrans">View Transaction</a>
            </li>
          
          </ul>

          {/* Buttons */}
          <div className="ms-auto d-flex align-items-center">
            <i
              className="bi bi-box-arrow-in-right mx-3 fs-4 text-primary"
              role="button"
              title="Login"
              onClick={() => navigate("/login")}
            ></i>
            <i
              className="bi bi-box-arrow-right mx-3 fs-4 text-danger"
              role="button"
              title="Logout"
              onClick={handleLogout}
            ></i>
          </div>
        </div>
      </div>
    </nav>
  );

  // Render Admin Dashboard
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container mt-5 flex-grow-1">
        <h1 className="text-center">Admin Dashboard</h1>

        {/* Error Display */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Display admin details */}
        {adminDetails ? (
          <div className="card shadow mt-4">
            <div className="card-body">
              <h3 className="card-title">Welcome, {adminDetails.fullName}!</h3>
              <p><strong>Email:</strong> {adminDetails.email}</p>
              <p><strong>Role:</strong> {adminDetails.role}</p>
              <p><strong>Username:</strong> {adminDetails.username}</p>
            </div>
          </div>
        ) : (
          <p>Loading admin details...</p> // Show while fetching admin details
        )}

        
        {/* <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div> */}
         <Footer />  {/* ✅ Footer at the Bottom */}
         
      </div>
    </div>
  );
};

export default AdminDashboard;
