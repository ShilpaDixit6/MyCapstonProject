import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer"; // ✅ Import Footer

const AddBeneficiary = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaryDetails, setBeneficiaryDetails] = useState(null);
  const [maxTransferLimit, setMaxTransferLimit] = useState("");
  const [userDetails, setUserDetails] = useState(null); // Fetch logged-in user's details
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/profile", {
          withCredentials: true, // Include session details
        });
        setUserDetails(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login"); // Redirect to login if not authenticated
        } else {
          setError("Error fetching user details. Please try again later.");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const fetchBeneficiaryDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/beneficiaries/fetch/${accountNumber}`
      );
      setBeneficiaryDetails(response.data);
      setError("");
    } catch (err) {
      setBeneficiaryDetails(null);
      setError(
        err.response?.data || "Error fetching beneficiary details. Try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails) {
      setError("Error: User not logged in.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/beneficiaries/add/${userDetails.email}`,
        {
          accountNumber,
          maxTransferLimit: parseFloat(maxTransferLimit),
        },
        { withCredentials: true } // Ensure cookies are included
      );
      setSuccessMessage(response.data.message);
      setError("");
      setBeneficiaryDetails(null); // Clear form
      setMaxTransferLimit("");
      setAccountNumber("");
    } catch (err) {
      setSuccessMessage("");
      setError(
        err.response?.data || "Error adding beneficiary. Try again."
      );
    }
  };

  const handleBack = () => {
    navigate("/dashboard"); // Redirect to the user dashboard
  };

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
      <Navbar />

      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow" style={{ width: "400px" }}>
          <h1 className="text-center mb-4">Add Beneficiary</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">
                Beneficiary Account Number
              </label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
              />
              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={fetchBeneficiaryDetails}
              >
                Fetch Details
              </button>
            </div>

            {beneficiaryDetails && (
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Beneficiary Details</h5>
                  <p><strong>Full Name:</strong> {beneficiaryDetails.fullName}</p>
                  <p><strong>Bank Name:</strong> {beneficiaryDetails.bankName}</p>
                  <p><strong>Account Number:</strong> {beneficiaryDetails.accountNumber}</p>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="maxTransferLimit" className="form-label">
                Maximum Transfer Limit
              </label>
              <input
                type="number"
                className="form-control"
                id="maxTransferLimit"
                value={maxTransferLimit}
                onChange={(e) => setMaxTransferLimit(e.target.value)}
                placeholder="Enter maximum transfer limit"
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Add Beneficiary
            </button>
          </form>

          <button onClick={handleBack} className="btn btn-secondary mt-3 w-100">
            Back to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddBeneficiary;
