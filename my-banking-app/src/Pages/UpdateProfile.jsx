import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Components/Footer"; // ✅ Import Footer component

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        address: "",
    });

    const [passwordData, setPasswordData] = useState({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users/profile", {
                    withCredentials: true, // Send cookies/session details for authentication
                });
                setFormData({
                    fullName: response.data.fullName,
                    email: response.data.email,
                    phone: response.data.phone,
                    username: response.data.username,
                    address: response.data.address,
                });

                setPasswordData({ ...passwordData, email: response.data.email }); // Pre-fill email
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate("/login"); // Redirect to login if session is invalid
                } else {
                    setError("Error fetching user details. Please try again later.");
                }
            }
        };

        fetchUserDetails();
    }, [navigate]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Handle profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:8080/users/update", formData, {
                withCredentials: true, // Ensure authentication via session cookies
            });
            setSuccessMessage("Profile updated successfully!");
            setError("");
        } catch (err) {
            setSuccessMessage("");
            setError("Error updating profile. Please try again.");
        }
    };

    // Handle password update
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage("New password and confirmation password do not match!");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8080/api/auth/forgot-password", passwordData);
            setPasswordMessage(response.data);
        } catch (error) {
            setPasswordMessage(error.response?.data || "Error updating password.");
        }
    };

    // Handle back button click
    const handleBack = () => {
        navigate("/dashboard");
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
                        <li className="nav-item"><a className="nav-link" href="/transactions">View Transactions</a></li>
                        <li className="nav-item"><a className="nav-link" href="/beni">Add Beneficiary</a></li>
                        <li className="nav-item"><a className="nav-link" href="/transfer">Transfer Money</a></li>
                        <li className="nav-item"><a className="nav-link" href="/updateprofile">Profile</a></li>
                    </ul>
                    <div className="ms-auto d-flex align-items-center">
                        <i className="bi bi-box-arrow-in-right mx-3 fs-4 text-primary" role="button" title="Login" onClick={() => navigate("/login")}></i>
                        <i className="bi bi-person-circle mx-3 fs-4 text-info" role="button" title="Profile" onClick={() => navigate("/viewprofile")}></i>
                        <i className="bi bi-box-arrow-right mx-3 fs-4 text-danger" role="button" title="Logout" onClick={() => navigate("/logout")}></i>
                    </div>
                </div>
            </div>
        </nav>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Include Navbar */}
            <Navbar />

            {/* Smaller form container */}
            <div className="container d-flex justify-content-center align-items-center flex-grow-1">
                <div className="card p-4 shadow" style={{ width: "400px" }}>
                    <h4 className="text-center">Update Profile</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <input type="text" className="form-control form-control-sm mb-2" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
                        <input type="email" className="form-control form-control-sm mb-2" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                        <input type="text" className="form-control form-control-sm mb-2" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
                        <input type="text" className="form-control form-control-sm mb-2" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
                        <textarea className="form-control form-control-sm mb-2" name="address" placeholder="Address" rows="1" value={formData.address} onChange={handleInputChange} required></textarea>
                        <button type="submit" className="btn btn-success btn-sm mt-2 w-100">Update</button>
                    </form>

                    {/* Forgot Password Section */}
                    <div className="card mt-4 p-3 shadow">
                        <h4 className="text-center">Forgot Password</h4>
                        {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
                        <form onSubmit={handlePasswordSubmit}>
                            <input type="password" className="form-control form-control-sm mb-2" name="oldPassword" placeholder="Old Password" onChange={handlePasswordChange} required />
                            <input type="password" className="form-control form-control-sm mb-2" name="newPassword" placeholder="New Password" onChange={handlePasswordChange} required />
                            <input type="password" className="form-control form-control-sm mb-2" name="confirmPassword" placeholder="Confirm Password" onChange={handlePasswordChange} required />
                            <button type="submit" className="btn btn-primary btn-sm mt-2 w-100">Update Password</button>
                        </form>
                    </div>

                    <button onClick={handleBack} className="btn btn-secondary btn-sm mt-2 w-100">Back to Dashboard</button>
                </div>
            </div>

            {/* Include Footer */}
            <Footer />
        </div>
    );
};

export default UpdateProfile;
