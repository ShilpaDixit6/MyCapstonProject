import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer"; // ✅ Import Footer component

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch transactions on component mount
    axios
      .get("http://localhost:8080/api/transactions/view", { withCredentials: true }) // Ensure session is included
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.error : "Unable to fetch transactions.";
        setError(errorMessage);
      });
  }, []);

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
        <h1 className="text-center mb-4">View Transactions</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {transactions.length > 0 ? (
          <table className="table table-striped">
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
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
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

export default ViewTransactions;
