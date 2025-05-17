import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer"; // ✅ Import Footer component
import "bootstrap/dist/css/bootstrap.min.css";

const ViewProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users/profile", {
                    withCredentials: true, // Send cookies/session details for authentication
                });
                setUserDetails(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    // Redirect to login if session is invalid
                    navigate("/login");
                } else {
                    setError("Error fetching user details. Please try again later.");
                }
            }
        };

        fetchUserDetails();
    }, [navigate]);

    if (!userDetails) {
        return <p>Loading user details...</p>; // Display loading state
    }

    // Mask sensitive fields
    const maskedAccountNumber = "XXXX-XXXX-XXXX-" + userDetails.accountNumber.slice(-4);
    const maskedBalance = "XXXX";

    // Handle back button click
    const handleBack = () => {
        navigate("/dashboard"); // Redirect to the user dashboard
    };

    // Navbar Component
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
                            onClick={() => navigate("/logout")}
                        ></i>
                    </div>
                </div>
            </div>
        </nav>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Include Navbar at the top */}
            <Navbar />

            <div className="container mt-5 flex-grow-1">
                <h4 className="text-center">View Profile</h4>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="card shadow mt-4">
                    <div className="card-body">
                        <h3 className="card-title">Welcome, {userDetails.fullName}!</h3>
                        <p><strong>Bank Name:</strong> {userDetails.bankName}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>Phone:</strong> {userDetails.phone}</p>
                        <p><strong>Username:</strong> {userDetails.username}</p>
                        <p><strong>Account Number:</strong> {maskedAccountNumber}</p>
                        <p><strong>Balance:</strong> {maskedBalance}</p>
                        <p><strong>Role:</strong> {userDetails.role}</p>
                        <p><strong>Address:</strong> {userDetails.address}</p>
                    </div>
                </div>

                {/* Back Button */}
                <button onClick={handleBack} className="btn btn-secondary mt-3">
                    Back to Dashboard
                </button>
            </div>

            {/* Include Footer at the bottom */}
            <Footer />
        </div>
    );
};

export default ViewProfile;
