import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import Footer from "../Components/Footer"; // ✅ Import Footer Component

const AdminViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch transactions from the API
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/admin/transactions");
                setTransactions(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching transactions: " + err.message);
                setLoading(false);
            }
        };

        fetchTransactions();
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
                <h1 className="text-center mb-4">Transactions Details</h1>

                {loading && <p>Loading transactions...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <table border="1" style={{ width: "100%", textAlign: "left" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sender Account</th>
                                <th>Receiver Account</th>
                                <th>Amount</th>
                                <th>Transaction Type</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.senderAccount}</td>
                                    <td>{transaction.receiverAccount}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.transactionType}</td>
                                    <td>{transaction.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

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

export default AdminViewTransactions;
