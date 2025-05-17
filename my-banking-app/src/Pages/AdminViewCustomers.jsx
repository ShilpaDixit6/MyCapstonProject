import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Footer from "../Components/Footer"; // Import Footer
import "../Css/AdminView.css";

const AdminViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch customers from the backend
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/admin/customers/view"
                );
                setCustomers(response.data); // Set customers data
            } catch (err) {
                setError("Error fetching customer details.");
            }
        };

        fetchCustomers();
    }, []);

    // Handle back button click
    const handleBack = () => {
        navigate("/admdash"); // Redirect to the admin dashboard
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
                            <a className="nav-link" href="/adminview">View Customers</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/adviewTrans">View Transactions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/admdash">Dashboard</a>
                        </li>
                    </ul>
                    <div className="ms-auto d-flex align-items-center">
                        <i
                            className="bi bi-box-arrow-in-right mx-3 fs-4 text-primary"
                            role="button"
                            title="Login"
                            onClick={() => navigate("/admin-login")}
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
                <h2 className="text-center mb-4">Customer Details</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}
                <table border="1" style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.fullName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default AdminViewCustomers;
