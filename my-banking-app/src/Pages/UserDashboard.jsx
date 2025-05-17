import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/UserDashboard.css"; // Import custom CSS for styling
import Footer from "../Components/Footer";  // ✅ Import Footer

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null); // State to hold user details
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  // Fetch user details from the /dashboard endpoint
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/dashboard", {
          withCredentials: true, // Ensures session cookies are sent with the request
        });
        setUserDetails(response.data); // Set user details in state
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // If unauthorized, redirect to login
          navigate("/login");
        } else {
          setError("Error fetching user details. Please try again later.");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, {
        withCredentials: true, // Send session cookies to invalidate the session
      });
      navigate("/login"); // Redirect to login on successful logout
    } catch (err) {
      setError("Error logging out. Please try again.");
    }
  };

  // Render Navbar
  const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light small-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        <a className="navbar-brand" href="#">
          <i className="bi bi-bank fs-2 text-primary">Dixit Bank</i>
        </a>


        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="/transactions">View Transactions</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/beni">Add Beneficiary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/transfer">Transfer Money</a>
              
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/benilist">List Beneficiaries</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/updateprofile">Profile</a>
            </li>
          </ul>
          <div className="ms-auto d-flex align-items-center">
            <i
              className="bi bi-box-arrow-in-right mx-3 fs-4 text-primary"
              role="button"
              title="Login"
              onClick={() => navigate("/login")}
            ></i>
            <i
              className="bi bi-person-circle mx-3 fs-4 text-info"
              role="button"
              title="Profile"
              onClick={() => navigate("/viewprofile")}
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

  // Render Footer
  const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Dixit Bank. All rights reserved.</p>
          <ul className="footer-links">
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    );
  };

  // Render the dashboard
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container mt-5 flex-grow-1">
        <h1 className="text-center">User Dashboard</h1>

        {/* Error Display */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Display user details */}
        {userDetails ? (
          <div className="card shadow mt-4">
            <div className="card-body">
              <h3 className="card-title">Welcome, {userDetails.fullName}!</h3>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Role:</strong> {userDetails.role}</p>
              <p><strong>Bank Name:</strong> Dixit Bank</p>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p> // Show while fetching user details
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
